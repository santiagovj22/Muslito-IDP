from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ─── App ──────────────────────────────────────────────────────────────────
    APP_ENV: Literal["development", "staging", "production", "test"] = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # ─── Service metadata ─────────────────────────────────────────────────────
    SERVICE_NAME: str = "{{SERVICE_NAME}}"
    SERVICE_VERSION: str = "1.0.0"

    # ─── CORS ─────────────────────────────────────────────────────────────────
    # Comma-separated origins, or '*' for development
    CORS_ORIGINS: str = "*"

    # ─── Rate limiting ────────────────────────────────────────────────────────
    RATE_LIMIT_MAX: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # ─── Add your service-specific settings below ─────────────────────────────
    # DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/mydb"
    # JWT_SECRET: str = "change-me"
    # AWS_REGION: str = "us-east-1"

    @property
    def cors_origins_list(self) -> list[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
