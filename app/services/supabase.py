from supabase import create_client, Client
from app.core.config import settings

# ===== HTTP/2 StreamReset エラー対策 =====
# Railway環境でのSupabase接続時にHTTP/2のストリームリセットエラーが発生していたため、
# requirements.txtで以下の対策を実施:
# 1. httpx==0.23.3 に固定（HTTP/2がデフォルトで無効のバージョン）
# 2. httpcore==0.16.3 に固定（安定版）
# 3. supabase==2.3.4 に固定（実績のある安定版）
#
# これらのバージョンではHTTP/2が使用されないため、StreamResetエラーは発生しません。
# ==========================================

# Supabaseクライアントの初期化
client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
