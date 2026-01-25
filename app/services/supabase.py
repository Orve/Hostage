import httpx
from functools import wraps

# ===== HTTP/2 StreamReset エラー対策 =====
# Railway環境でのSupabase接続時にHTTP/2のストリームリセットエラーが発生するため、
# httpx.Client の __init__ をラップしてHTTP/2を強制的に無効化
#
# この方法は:
# 1. supabase-py が内部で httpx.Client を作成する際に自動的に適用される
# 2. http2パラメータを常にFalseに上書きする
# 3. 他のパラメータは全て正常に渡される
# ==========================================

# オリジナルの httpx.Client.__init__ を保存
_original_client_init = httpx.Client.__init__

@wraps(_original_client_init)
def _patched_client_init(self, *args, **kwargs):
    """HTTP/2を強制的に無効化するhttpx.Client.__init__のラッパー"""
    # http2パラメータを強制的にFalseに設定
    kwargs['http2'] = False
    # オリジナルの__init__を呼び出し（__init__はNoneを返す）
    _original_client_init(self, *args, **kwargs)

# httpx.Client.__init__ をパッチ
httpx.Client.__init__ = _patched_client_init

# パッチ適用後にsupabaseをインポート
from supabase import create_client, Client
from app.core.config import settings

# Supabaseクライアントの初期化
# この時点で内部で作成されるhttpx.Clientは全てHTTP/1.1を使用
client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
