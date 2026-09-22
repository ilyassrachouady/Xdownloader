from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "X Media Extractor"
    environment: str = "development"
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    download_token_secret: str = "change-me-in-production"
    download_token_ttl: int = 7200  # long live remuxes
    cache_ttl: int = 600
    extraction_timeout: int = 90
    rate_limit_requests: int = 10
    rate_limit_window: int = 60
    download_timeout: int = 120
    hls_download_timeout: int = 7200  # up to ~2h remux window
    max_download_bytes: int = 4 * 1024 * 1024 * 1024  # 4 GB

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
