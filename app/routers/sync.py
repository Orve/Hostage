from fastapi import APIRouter, HTTPException, Query
from app.services.supabase import client
from datetime import datetime, timezone
import os

router = APIRouter(prefix="/cron", tags=["cron"])

@router.post("/sync")
def sync_overdue_tasks(user_id: str = Query(..., description="User ID to apply sync")):
    """
    期限切れのタスク（Supabase）を確認し、ペナルティ（ダメージ）を与えます。
    Source: Supabase 'tasks' table
    Condition: completed = false AND due_date < NOW
    Damage: 2.0 per task (Max 20.0)
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # 1. 期限切れタスクを取得 (Supabase Native)
    try:
        # Supabase filtering:
        # completed is false
        # due_date is less than now
        tasks_res = client.table("tasks") \
            .select("id", "title", "due_date") \
            .eq("user_id", user_id) \
            .eq("completed", False) \
            .lt("due_date", now_iso) \
            .execute()
            
        overdue_tasks = tasks_res.data if tasks_res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Query Error: {str(e)}")
        
    overdue_count = len(overdue_tasks)
    
    # ダメージ設定
    DAMAGE_PER_TASK = 2.0
    MAX_DAMAGE_CAP = 20.0
    
    raw_damage = overdue_count * DAMAGE_PER_TASK
    damage = min(raw_damage, MAX_DAMAGE_CAP)
    
    # 2. ユーザーのペットを取得
    pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    
    if not pet_res.data:
        # ペットがいない場合でも情報は返す
        return {
            "status": "No Active Pet",
            "overdue_count": overdue_count,
            "damage_dealt": 0
        }
        
    pet = pet_res.data[0]
    
    # 3. ダメージ適用
    if damage > 0:
        current_hp = float(pet['hp'])
        new_hp = max(0.0, current_hp - damage)
        status = 'DEAD' if new_hp == 0 else 'ALIVE'
        
        # 4. 更新
        update_data = {
            "hp": new_hp,
            "status": status,
            "last_checked_at": now_iso
        }
        client.table("pets").update(update_data).eq("id", pet['id']).execute()
        
        return {
            "status": "Synced",
            "pet_name": pet['name'],
            "overdue_count": overdue_count,
            "tasks": [t.get('title') for t in overdue_tasks], # タイトルも返す
            "damage_per_task": DAMAGE_PER_TASK,
            "damage_dealt": damage,
            "remaining_hp": new_hp
        }
    
    return {
        "status": "Synced (No Damage)",
        "overdue_count": 0,
        "damage_dealt": 0,
        "remaining_hp": pet['hp']
    }

@router.get("/damage")
def manual_damage(secret: str = Query(...)):
    """
    QAテスト用: 手動で全ペットにダメージを与える（検証用）
    """
    if secret != os.getenv("CRON_SECRET", "my_test_secret"):
        raise HTTPException(status_code=403, detail="Invalid Secret")

    # 本来は全ユーザーだが、テスト用なので「生きている全ペット」に固定ダメージを与える
    try:
        pets_res = client.table("pets").select("*").eq("status", "ALIVE").execute()
        if not pets_res.data:
            return {"message": "No active pets found"}

        damage_amount = 5.0
        processed_count = 0
        
        for pet in pets_res.data:
            new_hp = max(0.0, float(pet['hp']) - damage_amount)
            status = 'DEAD' if new_hp == 0 else 'ALIVE'
            
            client.table("pets").update({
                "hp": new_hp,
                "status": status
            }).eq("id", pet['id']).execute()
            processed_count += 1
            
        return {"message": "Damage processing complete", "processed": processed_count, "damage": damage_amount}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
