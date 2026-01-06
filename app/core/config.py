import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    NOTION_TOKEN: str
    NOTION_DB_ID: str

    class Config:
        env_file = ".env"

settings = Settings()
