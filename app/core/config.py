import os
import json
import boto3
from botocore.exceptions import ClientError
from pydantic_settings import BaseSettings
from functools import lru_cache


def _get_secret(arn: str) -> str:
    """Secrets ManagerからARNを指定してシークレット値を取得する"""
    region = os.getenv("AWS_REGION", "ap-northeast-1")
    client = boto3.client("secretsmanager", region_name=region)
    try:
        response = client.get_secret_value(SecretId=arn)
        return response["SecretString"]
    except ClientError as e:
        raise RuntimeError(f"Failed to retrieve secret {arn}: {e}") from e


class Settings(BaseSettings):
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    NOTION_TOKEN: str = ""
    NOTION_DB_ID: str = ""
    CRON_SECRET: str = ""
    ALLOWED_ORIGINS: str = "http://localhost:3000,https://hostage-app.vercel.app"

    def model_post_init(self, __context) -> None:
        """
        環境変数に *_ARN suffix がある場合はSecrets Managerから値を取得する。
        ない場合は従来通り環境変数の値をそのまま使う（ローカル開発・Railway互換）。
        """
        mappings = {
            "SUPABASE_SERVICE_ROLE_KEY": "SUPABASE_SERVICE_ROLE_KEY_ARN",
            "NOTION_TOKEN": "NOTION_TOKEN_ARN",
            "CRON_SECRET": "CRON_SECRET_ARN",
        }
        for field, arn_env in mappings.items():
            arn = os.getenv(arn_env)
            if arn:
                object.__setattr__(self, field, _get_secret(arn))

        # fail-closed: 認証に使う値が空のままでは起動させない
        required = {
            "SUPABASE_URL": self.SUPABASE_URL,
            "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_ROLE_KEY,
            "CRON_SECRET": self.CRON_SECRET,
        }
        missing = [k for k, v in required.items() if not v]
        if missing:
            raise RuntimeError(
                f"Missing required secrets: {', '.join(missing)}. "
                "Set the value directly via environment variable, or set the corresponding *_ARN variable."
            )

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
