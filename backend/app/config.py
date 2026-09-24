from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    port: int = 3001
    device_api_key: str = "vitallume_secret_device_key_2026"
    environment: str = "development"

    supabase_url: str | None = None
    supabase_key: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None

    temp_cold_threshold: float = 16.0
    temp_hot_threshold: float = 34.0
    humidity_low_threshold: float = 25.0
    humidity_high_threshold: float = 75.0
    gas_warning_ppm: float = 50.0
    gas_critical_ppm: float = 100.0
    sound_shock_db: float = 75.0
    radar_descent_velocity: float = 2.0
    respiration_low_rpm: float = 8.0
    respiration_high_rpm: float = 25.0
    device_offline_timeout_seconds: int = 90

    @property
    def supabase_api_key(self) -> str | None:
        return (
            self.supabase_service_role_key
            or self.supabase_key
            or self.supabase_anon_key
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
