"""
日次習慣管理APIエンドポイント

ストリーク追跡機能を持つ習慣のCRUD操作を提供。
チェックボタンで今日の完了/未完了をトグルする特殊ロジックを実装。
"""

from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta
from app.models.daily_habit import (
    DailyHabitCreate,
    DailyHabitResponse,
    DailyHabitListResponse,
    DailyHabitCheckResponse
)
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
from app.core.auth import get_current_user

router = APIRouter(prefix="/daily-habits", tags=["daily-habits"])


def is_same_day(dt1: datetime, dt2: datetime, tz_offset_hours: int = 9) -> bool:
    tz = timezone(timedelta(hours=tz_offset_hours))

    if dt1.tzinfo is None:
        dt1 = dt1.replace(tzinfo=timezone.utc)
    if dt2.tzinfo is None:
        dt2 = dt2.replace(tzinfo=timezone.utc)

    d1 = dt1.astimezone(tz).date()
    d2 = dt2.astimezone(tz).date()

    return d1 == d2


def is_yesterday(dt: datetime, tz_offset_hours: int = 9) -> bool:
    tz = timezone(timedelta(hours=tz_offset_hours))
    now = datetime.now(timezone.utc).astimezone(tz)

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    dt_local = dt.astimezone(tz)
    yesterday = now.date() - timedelta(days=1)

    return dt_local.date() == yesterday


@router.get("/", response_model=DailyHabitListResponse)
def get_user_habits(limit: int = 50, current_user: str = Depends(get_current_user)):
    response = client.table("daily_habits")\
        .select("*")\
        .eq("user_id", current_user)\
        .order("created_at", desc=True)\
        .limit(limit)\
        .execute()

    habits = response.data or []

    return {
        "habits": habits,
        "total": len(habits)
    }


@router.post("/", response_model=DailyHabitResponse)
def create_habit(habit_in: DailyHabitCreate, current_user: str = Depends(get_current_user)):
    new_habit = {
        "user_id": current_user,
        "title": habit_in.title,
        "streak": 0,
        "last_completed_at": None
    }

    response = client.table("daily_habits").insert(new_habit).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create daily habit")

    return response.data[0]


@router.put("/{habit_id}/check", response_model=DailyHabitCheckResponse)
def toggle_habit_check(habit_id: str, current_user: str = Depends(get_current_user)):
    """
    習慣の「完了/未完了」をトグルする。

    ロジック:
    1. 今日すでに完了している場合: キャンセル処理
    2. 今日まだの場合: 完了処理（ストリーク更新 + HP回復）
    """
    habit_res = client.table("daily_habits")\
        .select("*")\
        .eq("id", habit_id)\
        .execute()

    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Daily habit not found")

    habit = habit_res.data[0]

    if str(habit["user_id"]) != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your habit")

    now = datetime.now(timezone.utc)

    last_completed_str = habit.get("last_completed_at")
    current_streak = habit.get("streak", 0)

    last_completed: datetime | None = None
    if last_completed_str:
        try:
            last_completed = datetime.fromisoformat(
                last_completed_str.replace('Z', '+00:00')
            )
        except ValueError:
            last_completed = None

    healed_amount = 0.0

    if last_completed and is_same_day(last_completed, now):
        new_streak = max(0, current_streak - 1)
        new_last_completed = None

        update_data = {
            "streak": new_streak,
            "last_completed_at": new_last_completed
        }

        action = "unchecked"
        message = f"習慣をキャンセルしました。ストリーク: {new_streak}日"
    else:
        if last_completed and is_yesterday(last_completed):
            new_streak = current_streak + 1
        else:
            new_streak = 1

        update_data = {
            "streak": new_streak,
            "last_completed_at": now.isoformat()
        }

        action = "checked"
        message = f"🔥 {new_streak}日連続達成！" if new_streak > 1 else "習慣を完了しました！"

        pet_res = client.table("pets").select("*").eq("user_id", current_user).eq("status", "ALIVE").execute()

        if pet_res.data:
            pet_data = pet_res.data[0]
            decayed_pet = calculate_time_decay(pet_data)

            heal_amount = 10.0

            if decayed_pet['status'] == 'ALIVE':
                new_hp = min(float(decayed_pet['max_hp']), decayed_pet['hp'] + heal_amount)
                decayed_pet['hp'] = new_hp
                healed_amount = heal_amount

            pet_update = {
                "hp": decayed_pet['hp'],
                "status": decayed_pet['status'],
                "last_checked_at": datetime.now(timezone.utc).isoformat()
            }

            client.table("pets").update(pet_update).eq("id", pet_data['id']).execute()

    update_res = client.table("daily_habits")\
        .update(update_data)\
        .eq("id", habit_id)\
        .execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update daily habit")

    updated_habit = update_res.data[0]

    return {
        "habit": updated_habit,
        "action": action,
        "new_streak": new_streak,
        "message": message,
        "healed": healed_amount
    }


@router.delete("/{habit_id}")
def delete_habit(habit_id: str, current_user: str = Depends(get_current_user)):
    habit_res = client.table("daily_habits")\
        .select("id", "user_id")\
        .eq("id", habit_id)\
        .execute()

    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Daily habit not found")

    if str(habit_res.data[0]["user_id"]) != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your habit")

    delete_res = client.table("daily_habits")\
        .delete()\
        .eq("id", habit_id)\
        .execute()

    if not delete_res.data:
        raise HTTPException(status_code=500, detail="Failed to delete daily habit")

    return {
        "status": "deleted",
        "habit_id": habit_id
    }
