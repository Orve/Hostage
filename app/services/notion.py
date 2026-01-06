# from notion_client import Client # Library issue, switching to raw HTTP
import httpx
from app.core.config import settings
from datetime import datetime, timezone

class NotionService:
    def __init__(self):
        self.token = settings.NOTION_TOKEN
        self.db_id = settings.NOTION_DB_ID
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Notion-Version": "2022-06-28", # Stable version
            "Content-Type": "application/json"
        }
        self.base_url = "https://api.notion.com/v1"

    def get_overdue_tasks(self):
        """
        期限切れかつ未完了のタスクを取得します。 (Raw HTTP)
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        
        url = f"{self.base_url}/databases/{self.db_id}/query"
        
        payload = {
            "filter": {
                "and": [
                    {
                        "property": "Status", 
                        "status": {
                            "does_not_equal": "Done"
                        }
                    },
                    {
                        "property": "Due Date",
                        "date": {
                            "before": now_iso
                        }
                    }
                ]
            }
        }

        # Supabase includes httpx, so we can use it synchronously for now
        with httpx.Client() as client:
            response = client.post(url, headers=self.headers, json=payload)
            
            if response.status_code != 200:
                print(f"Notion API Error: {response.text}")
                # エラーでも落とさないようにする（空リストを返す）
                # あるいは例外を投げる
                # MVPなのでログ出して空リスト
                return []
            
            data = response.json()
            return data.get("results", [])

notion_service = NotionService()
