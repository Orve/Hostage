from fastapi import APIRouter, HTTPException, Header, Depends
from app.services.supabase import client
from app.core.auth import get_current_user
from app.core.config import settings
from datetime import datetime, timezone

router = APIRouter(prefix="/cron", tags=["cron"])


@router.post("/sync")
def sync_and_punish(current_user: str = Depends(get_current_user)):
    """
    [The Executioner Protocol]
    認証済みユーザー自身のペットにダメージ計算を適用する。
    1. Time Decay: 0.5 HP / hour (Linear)
    2. Task Penalty: 5.0 HP / overdue task
    """
    pet_res = client.table("pets").select("*").eq("user_id", current_user).eq("status", "ALIVE").execute()
    if not pet_res.data:
        return {"status": "No Active Pet"}

    pet = pet_res.data[0]

    if pet['status'] == 'DEAD':
        return {"status": "Pet is already dead", "pet_name": pet['name']}

    now_iso = datetime.now(timezone.utc).isoformat()

    tasks_res = client.table("tasks") \
        .select("id", count="exact") \
        .eq("user_id", current_user) \
        .neq("completed", True) \
        .lt("due_date", now_iso) \
        .execute()

    overdue_count = tasks_res.count if tasks_res.count is not None else 0

    damage_time = 0.0
    if pet.get('last_checked_at'):
        try:
            last_checked = datetime.fromisoformat(pet['last_checked_at'].replace('Z', '+00:00'))
            diff = datetime.now(timezone.utc) - last_checked
            hours_passed = diff.total_seconds() / 3600.0

            if hours_passed > 0:
                damage_time = hours_passed * 0.5
        except ValueError:
            pass

    DAMAGE_PER_TASK = 5.0
    damage_penalty = overdue_count * DAMAGE_PER_TASK

    total_damage = damage_time + damage_penalty

    current_hp = float(pet.get('hp', 100))
    new_hp = max(0.0, current_hp - total_damage)

    new_status = "ALIVE"
    if new_hp <= 0:
        new_status = "DEAD"

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
def manual_damage(
    x_api_key: str = Header(..., alias="X-API-KEY")
):
    """
    QAテスト用: 手動で全ペットにダメージを与える（検証用）
    セキュリティ: X-API-KEY ヘッダーで認証（CRON_SECRET 環境変数必須）
    """
    if x_api_key != settings.CRON_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Secret")

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
