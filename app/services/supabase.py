from supabase import create_client, Client
from app.core.config import settings

# Supabaseクライアントの初期化
client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
