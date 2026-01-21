import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    NOTION_TOKEN: str
    NOTION_DB_ID: str
    
    # Cron用APIキー（ダメージ適用エンドポイントの認証）
    CRON_SECRET: str = "hostage_cron_secret_2026"

    class Config:
        env_file = ".env"
        extra = "ignore"  # 未知の環境変数を無視

settings = Settings()

