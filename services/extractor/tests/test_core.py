from __future__ import annotations

import time

import pytest

from app.core.security import (
    TokenError,
    UrlValidationError,
    create_download_token,
    validate_twitter_url,
    verify_download_token,
)
from app.services.twitter_extractor import filter_formats


class TestUrlValidation:
    def test_valid_x_url(self) -> None:
        result = validate_twitter_url("https://x.com/elonmusk/status/1234567890123456789")
        assert result.tweet_id == "1234567890123456789"
        assert result.normalized_url == "https://x.com/i/status/1234567890123456789"

    def test_valid_www_x_url(self) -> None:
        result = validate_twitter_url("https://www.x.com/user/status/999")
        assert result.tweet_id == "999"

    def test_valid_twitter_url(self) -> None:
        result = validate_twitter_url("https://twitter.com/nasa/status/42")
        assert result.tweet_id == "42"

    def test_valid_mobile_twitter_url(self) -> None:
        result = validate_twitter_url("https://mobile.twitter.com/nasa/status/42")
        assert result.tweet_id == "42"

    def test_valid_i_web_status(self) -> None:
        result = validate_twitter_url("https://x.com/i/web/status/12345")
        assert result.tweet_id == "12345"

    def test_rejects_unrelated_domain(self) -> None:
        with pytest.raises(UrlValidationError) as exc:
            validate_twitter_url("https://example.com/user/status/123")
        assert exc.value.code == "unsupported_domain"

    def test_rejects_missing_status_path(self) -> None:
        with pytest.raises(UrlValidationError) as exc:
            validate_twitter_url("https://x.com/username")
        assert exc.value.code == "invalid_path"

    def test_rejects_ftp(self) -> None:
        with pytest.raises(UrlValidationError):
            validate_twitter_url("ftp://x.com/user/status/123")

    def test_rejects_empty(self) -> None:
        with pytest.raises(UrlValidationError):
            validate_twitter_url("")


class TestDownloadTokens:
    def test_create_and_verify(self) -> None:
        token = create_download_token(
            media_url="https://video.twimg.com/ext_tw_video/abc.mp4",
            tweet_id="123",
            quality="720p",
            ext="mp4",
            secret="test-secret",
            ttl_seconds=600,
        )
        payload = verify_download_token(token, "test-secret")
        assert payload.tweet_id == "123"
        assert payload.quality == "720p"
        assert payload.ext == "mp4"

    def test_expired_token(self) -> None:
        token = create_download_token(
            media_url="https://video.twimg.com/ext_tw_video/abc.mp4",
            tweet_id="123",
            quality="720p",
            ext="mp4",
            secret="test-secret",
            ttl_seconds=-1,
        )
        # Ensure clock moved past expiry
        time.sleep(0.05)
        with pytest.raises(TokenError) as exc:
            verify_download_token(token, "test-secret")
        assert exc.value.code == "token_expired"

    def test_tampered_token(self) -> None:
        token = create_download_token(
            media_url="https://video.twimg.com/ext_tw_video/abc.mp4",
            tweet_id="123",
            quality="720p",
            ext="mp4",
            secret="test-secret",
            ttl_seconds=600,
        )
        body, sig = token.split(".", 1)
        with pytest.raises(TokenError):
            verify_download_token(f"{body}x.{sig}", "test-secret")


class TestFormatFiltering:
    def test_dedupes_and_sorts_by_height(self) -> None:
        formats = [
            {
                "format_id": "1",
                "url": "https://video.twimg.com/a.mp4",
                "ext": "mp4",
                "height": 360,
                "width": 640,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": 300,
                "protocol": "https",
            },
            {
                "format_id": "2",
                "url": "https://video.twimg.com/b.mp4",
                "ext": "mp4",
                "height": 720,
                "width": 1280,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": 800,
                "protocol": "https",
            },
            {
                "format_id": "3",
                "url": "https://video.twimg.com/c.mp4",
                "ext": "mp4",
                "height": 720,
                "width": 1280,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": 1200,
                "protocol": "https",
            },
            {
                "format_id": "audio",
                "url": "https://video.twimg.com/audio.m4a",
                "ext": "m4a",
                "vcodec": "none",
                "acodec": "mp4a",
                "protocol": "https",
            },
            {
                "format_id": "hls",
                "url": "https://video.twimg.com/stream.m3u8",
                "ext": "mp4",
                "height": 1080,
                "vcodec": "avc1",
                "protocol": "m3u8",
            },
        ]
        filtered = filter_formats(formats)
        heights = [f["height"] for f in filtered]
        assert heights == [720, 360]
        assert filtered[0]["format_id"] == "3"  # higher bitrate at 720p

    def test_falls_back_to_hls_for_live_replays(self) -> None:
        formats = [
            {
                "format_id": "replay-5500",
                "url": "https://prod-fastly-eu-west-3.video.pscp.tv/path/playlist.m3u8?type=replay",
                "ext": "mp4",
                "height": 1920,
                "width": 1080,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": 5500,
                "protocol": "m3u8_native",
            },
            {
                "format_id": "replay-1200",
                "url": "https://prod-fastly-eu-west-3.video.pscp.tv/path/low.m3u8?type=replay",
                "ext": "mp4",
                "height": 832,
                "width": 472,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "tbr": 1200,
                "protocol": "m3u8_native",
            },
        ]
        filtered = filter_formats(formats)
        assert len(filtered) == 2
        assert filtered[0]["height"] == 1920
        assert filtered[0]["_is_hls"] is True

    def test_prefers_progressive_over_hls(self) -> None:
        formats = [
            {
                "format_id": "http",
                "url": "https://video.twimg.com/a.mp4",
                "ext": "mp4",
                "height": 720,
                "vcodec": "avc1",
                "acodec": "mp4a",
                "protocol": "https",
            },
            {
                "format_id": "hls",
                "url": "https://video.twimg.com/stream.m3u8",
                "ext": "mp4",
                "height": 1080,
                "vcodec": "avc1",
                "protocol": "m3u8",
            },
        ]
        filtered = filter_formats(formats)
        assert len(filtered) == 1
        assert filtered[0]["format_id"] == "http"