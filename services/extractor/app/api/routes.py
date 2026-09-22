from __future__ import annotations

import asyncio
import logging
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

from app.core.config import Settings, get_settings
from app.core.security import UrlValidationError, validate_twitter_url
from app.schemas.requests import ResolveRequest
from app.schemas.responses import ErrorResponse, ResolveResponse
from app.services.download_service import stream_download, stream_thumbnail
from app.services.twitter_extractor import ExtractionError, resolve_media

logger = logging.getLogger(__name__)
router = APIRouter()


class InMemoryRateLimiter:
    """Simple fixed-window limiter; swap for Redis later."""

    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def is_allowed(self, key: str, limit: int, window_seconds: int) -> bool:
        now = time.time()
        with self._lock:
            bucket = self._hits[key]
            while bucket and now - bucket[0] >= window_seconds:
                bucket.popleft()
            if len(bucket) >= limit:
                return False
            bucket.append(now)
            return True


rate_limiter = InMemoryRateLimiter()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def _error(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content=ErrorResponse(error="error", code=code, message=message).model_dump(),
    )


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/resolve", response_model=ResolveResponse)
async def resolve(payload: ResolveRequest, request: Request) -> ResolveResponse | JSONResponse:
    settings: Settings = get_settings()
    ip = _client_ip(request)

    if not rate_limiter.is_allowed(ip, settings.rate_limit_requests, settings.rate_limit_window):
        return _error(
            429,
            "rate_limit",
            "Too many requests. Please wait a minute before trying again.",
        )

    try:
        validated = validate_twitter_url(payload.url)
    except UrlValidationError as exc:
        return _error(400, exc.code, exc.message)

    try:
        # Run blocking yt-dlp / network work off the event loop so /health stays responsive.
        return await asyncio.to_thread(resolve_media, validated, settings)
    except ExtractionError as exc:
        status = {
            "timeout": 504,
            "rate_limit": 429,
            "not_found": 404,
            "deleted": 404,
            "private_account": 403,
            "no_media": 422,
        }.get(exc.code, 502)
        return _error(status, exc.code, exc.message)
    except Exception:  # noqa: BLE001
        logger.exception("Unexpected resolve failure")
        return _error(
            500,
            "backend_error",
            "Something went wrong while processing this post. Please try again.",
        )


@router.get("/download/{token}")
async def download(token: str) -> object:
    settings = get_settings()
    try:
        return await stream_download(token, settings)
    except HTTPException:
        raise
    except Exception:  # noqa: BLE001
        logger.exception("Unexpected download failure")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "backend_error",
                "message": "Something went wrong while downloading. Please try again.",
            },
        )


@router.get("/thumb/{token}")
async def thumb(token: str) -> object:
    settings = get_settings()
    try:
        return await stream_thumbnail(token, settings)
    except HTTPException:
        raise
    except Exception:  # noqa: BLE001
        logger.exception("Unexpected thumbnail failure")
        raise HTTPException(
            status_code=500,
            detail={
                "code": "backend_error",
                "message": "Something went wrong while loading the thumbnail.",
            },
        )
