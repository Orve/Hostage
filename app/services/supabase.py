from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from app.core.config import settings

# HTTP/2問題を回避するためのオプション（タイムアウト延長）
opts = ClientOptions().replace(
    postgrest_client_timeout=10,
    storage_client_timeout=10
)

# Supabaseクライアントの初期化
client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY, options=opts)
