from fastapi import APIRouter, HTTPException, Query
from app.services.supabase import client
from datetime import datetime, timezone
import os

router = APIRouter(prefix="/cron", tags=["cron"])

@router.post("/sync")
def sync_and_punish(user_id: str = Query(..., description="User ID to apply sync")):
    """
    [The Executioner Protocol]
    1. Time Decay: 0.5 HP / hour (Linear)
    2. Task Penalty: 5.0 HP / overdue task
    """
    # 1. 現在のペット情報を取得
    pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    if not pet_res.data:
        # 生きてるペットがいなければ、死んだペットも含めて検索（ステータス更新のため）
        # ただし今回はMVPなので「Active Pet Only」とする
        return {"status": "No Active Pet"}
    
    pet = pet_res.data[0]

    # 2. 期限切れタスクの数を数える
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # Supabase filtering: status != 'DONE' AND due_date < NOW
    # count='exact', head=True を使いたいが、python clientの仕様上 select(count='exact') する
    tasks_res = client.table("tasks") \
        .select("id", count="exact") \
        .eq("user_id", user_id) \
        .neq("completed", True) \
        .lt("due_date", now_iso) \
        .execute()
    
    overdue_count = tasks_res.count if tasks_res.count is not None else 0

    # 3. ダメージ計算
    # -------------------------------------------------
    # A. 基礎代謝（時間経過）: Linear Decay
    # -------------------------------------------------
    damage_time = 0.0
    if pet.get('last_checked_at'):
        # Parse ISO string
        try:
            last_checked = datetime.fromisoformat(pet['last_checked_at'].replace('Z', '+00:00'))
            diff = datetime.now(timezone.utc) - last_checked
            hours_passed = diff.total_seconds() / 3600.0
            
            if hours_passed > 0:
                damage_time = hours_passed * 0.5
        except ValueError:
            pass # 日付フォーマットエラー時は時間ダメージなし

    # -------------------------------------------------
    # B. 懲罰（タスク滞留）
    # -------------------------------------------------
    DAMAGE_PER_TASK = 5.0 # タスク1個につき 5ダメージ
    damage_penalty = overdue_count * DAMAGE_PER_TASK

    # 4. 合計ダメージ適用
    total_damage = damage_time + damage_penalty
    
    current_hp = float(pet.get('hp', 100))
    new_hp = max(0.0, current_hp - total_damage)
    
    # ステータス更新
    new_status = "ALIVE"
    if new_hp <= 0:
        new_status = "DEAD"

    # 5. DBに保存（更新）
    # Time Decayを行ったので last_checked_at も更新する
    update_data = {
        "hp": new_hp,
        "status": new_status,
        "last_checked_at": now_iso
    }
    client.table("pets").update(update_data).eq("id", pet['id']).execute()

    return {
        "status": "Executed",
        "pet_name": pet['name'],
        "overdue_count": overdue_count,
        "damage_time": damage_time,
        "damage_penalty": damage_penalty,
        "total_damage": total_damage,
        "new_hp": new_hp,
        "new_status": new_status
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
