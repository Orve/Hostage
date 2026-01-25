import os
from supabase import create_client, Client

# ==========================================
# 🛡️ HTTP/2 DISABLE FLAG (The Magic Switch)
# ==========================================
# これにより、httpcoreライブラリが強制的にHTTP/1.1を使用します。
# "StreamReset" エラーを回避する最も確実な方法です。
os.environ["HTTPCORE_DISABLE_HTTP2"] = "1"

# ==========================================
# 🔑 Environment Variables
# ==========================================
# 設定ファイル(settings)を経由せず、OSから直接値を取得して確実性を高めます。
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

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
except Exception as e:
    print(f"🚨 Failed to initialize Supabase client: {e}")
    raise e
