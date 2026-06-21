import os
import httpx
from dotenv import load_dotenv  # 👈 追加: ライブラリをインポート

# 👇 追加: これが実行された瞬間に .env の中身がメモリに展開されます
load_dotenv()
# ==========================================
# 🛡️ HTTP/2 DISABLE FLAG (The Magic Switch)
# ==========================================
# これにより、httpcoreライブラリが強制的にHTTP/1.1を使用します。
# "StreamReset" エラーを回避する最も確実な方法です。
os.environ["HTTPCORE_DISABLE_HTTP2"] = "1"

# ==========================================
# 🔧 HTTPX CLIENT PATCH (Proxy Argument Fix)
# ==========================================
# gotrueライブラリがhttpx.Clientに古い形式のproxy引数を渡すため、
# 互換性レイヤーを追加して新しい形式に変換します。
_original_httpx_client_init = httpx.Client.__init__

def _patched_httpx_client_init(self, *args, **kwargs):
    """proxy引数を新しいproxies形式に変換するパッチ"""
    # 古い形式の proxy 引数を処理
    if 'proxy' in kwargs:
        proxy_value = kwargs.pop('proxy')  # 古いproxy引数を削除
        # proxy引数が指定されている場合のみproxiesに変換
        if proxy_value:
            kwargs['proxies'] = proxy_value

    # HTTP/2を強制的に無効化
    kwargs['http2'] = False

    # オリジナルの__init__を呼び出し
    _original_httpx_client_init(self, *args, **kwargs)

# パッチを適用
httpx.Client.__init__ = _patched_httpx_client_init

# パッチ適用後にsupabaseをインポート
from supabase import create_client, Client
from app.core.config import settings

# ==========================================
# 🔑 Environment Variables
# ==========================================
url = settings.SUPABASE_URL
key = settings.SUPABASE_SERVICE_ROLE_KEY

# デバッグ用: キーがない場合はRailwayのログに警告を出す
if not url:
    print("🚨 CRITICAL ERROR: SUPABASE_URL is missing in environment variables!")
if not key:
    print("🚨 CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables!")

# ==========================================
# 🚀 Client Initialization
# ==========================================
# シンプルな初期化に戻します。オプションは指定しません。
try:
    client: Client = create_client(url, key)
    # print("✅ Supabase client initialized successfully!")
except Exception as e:
    # print(f"🚨 Failed to initialize Supabase client: {e}")
    raise e
