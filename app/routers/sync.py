from fastapi import APIRouter, HTTPException, Query
from app.services.supabase import client
from app.services.notion import notion_service
from datetime import datetime, timezone

router = APIRouter(prefix="/cron", tags=["cron"])

@router.post("/sync")
def sync_notion_tasks(user_id: str = Query(..., description="User ID to apply sync")):
    """
    Notionの期日切れタスクを同期し、ペナルティ（ダメージ）を与えます。
    """
    # 1. Notionから期限切れタスクを取得
    # 注意: 本来はuser_idに紐づくNotion Tokenを使うべきですが、MVPでは環境変数を使用
    try:
        overdue_tasks = notion_service.get_overdue_tasks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notion API Error: {str(e)}")
        
    overdue_count = len(overdue_tasks)
    
    # 2. ユーザーのペットを取得
    pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    if not pet_res.data:
        return {
            "status": "No Active Pet",
            "overdue_count": overdue_count,
            "damage_dealt": 0
        }
        
    pet = pet_res.data[0]
    
    # 3. ダメージ計算
    # 未完了タスク1つにつき 5ダメージ (仮)
    DAMAGE_PER_TASK = 5.0
    damage = overdue_count * DAMAGE_PER_TASK
    
    if damage > 0:
        current_hp = float(pet['hp'])
        new_hp = max(0.0, current_hp - damage)
        status = 'DEAD' if new_hp == 0 else 'ALIVE'
        
        # 4. 更新
        update_data = {
            "hp": new_hp,
            "status": status,
            "last_checked_at": datetime.now(timezone.utc).isoformat()
        }
        client.table("pets").update(update_data).eq("id", pet['id']).execute()
        
        return {
            "status": "Synced",
            "pet_name": pet['name'],
            "overdue_count": overdue_count,
            "damage_dealt": damage,
            "remaining_hp": new_hp
        }
    
    return {
        "status": "Synced (No Damage)",
        "overdue_count": 0,
        "damage_dealt": 0
    }
