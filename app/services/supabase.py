from supabase import create_client, Client
from app.core.config import settings
import httpx

# ===== HTTP/2 StreamReset エラー対策 =====
# Railway環境でのSupabase接続時にHTTP/2のストリームリセットエラーが発生するため、
# HTTP/1.1を強制的に使用する設定を適用
#
# 対策内容:
# 1. httpx.Client のデフォルト動作を HTTP/1.1 に変更
# 2. requirements.txt で httpx==0.24.1 (HTTP/2問題が少ないバージョン) に固定
# ==========================================

# httpx.Clientをパッチして、全てのHTTPリクエストでHTTP/1.1を強制
_original_httpx_client = httpx.Client

class PatchedClient(_original_httpx_client):
    """HTTP/2を無効化したhttpxクライアント"""
    def __init__(self, *args, **kwargs):
        # http2パラメータを強制的にFalseに設定
        kwargs['http2'] = False
        super().__init__(*args, **kwargs)

# グローバルに適用（supabase-pyが内部で使用するhttpxクライアントに影響）
httpx.Client = PatchedClient

# Supabaseクライアントの初期化
# この時点で、内部で使われるhttpxクライアントはHTTP/1.1のみを使用
client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
