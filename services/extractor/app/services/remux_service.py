"""Background HLS → MP4 remux jobs.

Browsers often disconnect mid-stream or save incomplete fragmented MP4s that
only play the first ~8s segment. Remux to a real faststart MP4 on disk, then
serve the finished file with Content-Length.
"""

from __future__ import annotations

import asyncio
import logging
import os
import secrets
import shutil
import tempfile
import time
from dataclasses import dataclass, field
from pathlib import Path
from threading import Lock

from fastapi import HTTPException
from fastapi.responses import FileResponse

from app.core.config import Settings
from app.core.security import TokenError, verify_download_token

logger = logging.getLogger(__name__)

_JOB_TTL_SECONDS = 3600
_MAX_JOBS = 8


@dataclass
class RemuxJob:
    id: str
    tweet_id: str
    quality: str
    status: str = "queued"  # queued | running | done | error
    error: str | None = None
    path: str | None = None
    bytes_out: int = 0
    created_at: float = field(default_factory=time.time)
    finished_at: float | None = None


_jobs: dict[str, RemuxJob] = {}
_lock = Lock()
_token_to_job: dict[str, str] = {}


def _cleanup_locked(now: float | None = None) -> None:
    now = now or time.time()
    dead = [
        jid
        for jid, job in _jobs.items()
        if now - job.created_at > _JOB_TTL_SECONDS
        or (job.finished_at and now - job.finished_at > _JOB_TTL_SECONDS)
    ]
    for jid in dead:
        job = _jobs.pop(jid, None)
        if job and job.path:
            try:
                os.unlink(job.path)
            except OSError:
                pass
    # drop token map entries pointing at removed jobs
    for tok, jid in list(_token_to_job.items()):
        if jid not in _jobs:
            _token_to_job.pop(tok, None)


def get_job(job_id: str) -> RemuxJob | None:
    with _lock:
        _cleanup_locked()
        return _jobs.get(job_id)


async def start_remux_job(token: str, settings: Settings) -> RemuxJob:
    try:
        payload = verify_download_token(token, settings.download_token_secret)
    except TokenError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": exc.message}) from exc

    if not payload.is_hls:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "not_hls",
                "message": "This download does not need remux — use the normal download link.",
            },
        )

    with _lock:
        _cleanup_locked()
        existing_id = _token_to_job.get(token)
        if existing_id and existing_id in _jobs:
            existing = _jobs[existing_id]
            if existing.status in ("queued", "running", "done"):
                return existing
        if sum(1 for j in _jobs.values() if j.status in ("queued", "running")) >= _MAX_JOBS:
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "busy",
                    "message": "Too many live remuxes running. Please try again in a minute.",
                },
            )
        job = RemuxJob(
            id=secrets.token_urlsafe(18),
            tweet_id=payload.tweet_id,
            quality=payload.quality,
        )
        _jobs[job.id] = job
        _token_to_job[token] = job.id

    asyncio.create_task(_run_remux(job.id, payload.media_url, settings.hls_download_timeout))
    return job


async def _run_remux(job_id: str, media_url: str, timeout: int) -> None:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            return
        job.status = "running"

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        with _lock:
            job = _jobs.get(job_id)
            if job:
                job.status = "error"
                job.error = "ffmpeg is not available on the server."
                job.finished_at = time.time()
        return

    tmp_dir = Path(tempfile.gettempdir()) / "savex-remux"
    tmp_dir.mkdir(parents=True, exist_ok=True)
    out_path = tmp_dir / f"{job_id}.mp4"

    header_lines = (
        "Referer: https://www.periscope.tv/\r\n"
        "Origin: https://www.periscope.tv\r\n"
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\r\n"
    )
    # Write a proper MP4 (faststart) so players see the full duration.
    cmd = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-reconnect",
        "1",
        "-reconnect_streamed",
        "1",
        "-reconnect_on_network_error",
        "1",
        "-reconnect_delay_max",
        "10",
        "-headers",
        header_lines,
        "-i",
        media_url,
        "-c",
        "copy",
        "-bsf:a",
        "aac_adtstoasc",
        "-movflags",
        "+faststart",
        str(out_path),
    ]

    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            _, stderr = await asyncio.wait_for(process.communicate(), timeout=float(timeout))
        except asyncio.TimeoutError:
            process.kill()
            await process.wait()
            with _lock:
                job = _jobs.get(job_id)
                if job:
                    job.status = "error"
                    job.error = "Remux timed out. Try a lower quality."
                    job.finished_at = time.time()
            try:
                out_path.unlink(missing_ok=True)
            except OSError:
                pass
            return

        if process.returncode != 0 or not out_path.is_file() or out_path.stat().st_size < 1024:
            err = (stderr or b"").decode("utf-8", "ignore")[:500]
            logger.warning("Remux job %s failed rc=%s: %s", job_id, process.returncode, err)
            with _lock:
                job = _jobs.get(job_id)
                if job:
                    job.status = "error"
                    job.error = "We couldn't remux this live replay. Please try again."
                    job.finished_at = time.time()
            try:
                out_path.unlink(missing_ok=True)
            except OSError:
                pass
            return

        size = out_path.stat().st_size
        with _lock:
            job = _jobs.get(job_id)
            if job:
                job.status = "done"
                job.path = str(out_path)
                job.bytes_out = size
                job.finished_at = time.time()
        logger.info("Remux job %s done bytes=%s", job_id, size)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Remux job %s crashed: %s", job_id, exc)
        with _lock:
            job = _jobs.get(job_id)
            if job:
                job.status = "error"
                job.error = "Remux failed unexpectedly. Please try again."
                job.finished_at = time.time()
        try:
            out_path.unlink(missing_ok=True)
        except OSError:
            pass


def file_response_for_job(job_id: str) -> FileResponse:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(
                status_code=404,
                detail={"code": "not_found", "message": "Remux job not found or expired."},
            )
        if job.status != "done" or not job.path:
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "not_ready",
                    "message": job.error or "Remux is still running.",
                },
            )
        path = job.path
        filename = f"x-live-{job.tweet_id}-{job.quality}.mp4"

    if not os.path.isfile(path):
        raise HTTPException(
            status_code=404,
            detail={"code": "not_found", "message": "Remux file is missing. Please start again."},
        )

    return FileResponse(
        path,
        media_type="video/mp4",
        filename=filename,
        headers={
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )
