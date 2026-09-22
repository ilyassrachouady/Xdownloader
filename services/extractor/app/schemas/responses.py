from pydantic import BaseModel, Field


class MediaFormat(BaseModel):
    format_id: str
    quality: str
    width: int | None = None
    height: int | None = None
    ext: str
    filesize: int | None = None
    download_url: str
    vcodec: str | None = None
    acodec: str | None = None
    is_hls: bool = False


class ResolveResponse(BaseModel):
    id: str
    title: str | None = None
    description: str | None = None
    uploader: str | None = None
    uploader_id: str | None = None
    thumbnail: str | None = None
    duration: float | None = None
    webpage_url: str | None = None
    media_kind: str = "video"  # video | live_replay | live
    formats: list[MediaFormat] = Field(default_factory=list)


class ErrorResponse(BaseModel):
    error: str
    code: str
    message: str
