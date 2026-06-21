"""
日次習慣管理APIエンドポイント

ストリーク追跡機能を持つ習慣のCRUD操作を提供。
チェックボタンで今日の完了/未完了をトグルする特殊ロジックを実装。
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from app.models.daily_habit import (
    DailyHabitCreate,
    DailyHabitResponse,
    DailyHabitListResponse,
    DailyHabitCheckResponse
)
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay, update_care_score

router = APIRouter(prefix="/daily-habits", tags=["daily-habits"])


def is_same_day(dt1: datetime, dt2: datetime, tz_offset_hours: int = 9) -> bool:
    """
    2つの日時が同じ日（JST基準）かどうかを判定する。
    
    Args:
        dt1: 比較対象の日時1
        dt2: 比較対象の日時2
        tz_offset_hours: タイムゾーンオフセット（デフォルト: JST = +9）
    
    Returns:
        同じ日であればTrue
    """
    tz = timezone(timedelta(hours=tz_offset_hours))
    
    # UTCからJSTに変換して日付を比較
    if dt1.tzinfo is None:
        dt1 = dt1.replace(tzinfo=timezone.utc)
    if dt2.tzinfo is None:
        dt2 = dt2.replace(tzinfo=timezone.utc)
    
    d1 = dt1.astimezone(tz).date()
    d2 = dt2.astimezone(tz).date()
    
    return d1 == d2


def is_yesterday(dt: datetime, tz_offset_hours: int = 9) -> bool:
    """
    指定日時が昨日かどうかを判定する（JST基準）。
    
    ストリーク継続判定に使用: 昨日完了していれば今日チェックでストリーク+1
    """
    tz = timezone(timedelta(hours=tz_offset_hours))
    now = datetime.now(timezone.utc).astimezone(tz)
    
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    
    dt_local = dt.astimezone(tz)
    yesterday = now.date() - timedelta(days=1)
    
    return dt_local.date() == yesterday


@router.get("/{user_id}", response_model=DailyHabitListResponse)
def get_user_habits(user_id: str, limit: int = 50):
    """
    ユーザーの日次習慣一覧を取得する。
    
    Args:
        user_id: ユーザーID
        limit: 取得件数上限
    
    Returns:
        習慣一覧とトータル件数
    """
    response = client.table("daily_habits")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .limit(limit)\
        .execute()
    
    habits = response.data or []
    
    return {
        "habits": habits,
        "total": len(habits)
    }


@router.post("/", response_model=DailyHabitResponse)
def create_habit(habit_in: DailyHabitCreate):
    """
    新しい日次習慣を作成する。
    
    初期状態: streak=0, last_completed_at=NULL
    """
    new_habit = {
        "user_id": habit_in.user_id,
        "title": habit_in.title,
        "streak": 0,
        "last_completed_at": None
    }
    
    response = client.table("daily_habits").insert(new_habit).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create daily habit")
    
    return response.data[0]


@router.put("/{habit_id}/check", response_model=DailyHabitCheckResponse)
def toggle_habit_check(habit_id: str):
    """
    習慣の「完了/未完了」をトグルする。
    
    ロジック:
    1. 今日すでに完了している場合:
       - キャンセル処理: streak -1, last_completed_at を前日 or null に戻す
    
    2. 今日まだの場合:
       - 完了処理: streak +1 (昨日も完了していた場合) または streak=1 (連続途切れ)
       - last_completed_at = now
    
    Note:
        ストリークは「連続日数」なので、昨日完了していた場合のみ継続。
        2日以上空いた場合はストリークがリセットされる。
    """
    # 習慣を取得
    habit_res = client.table("daily_habits")\
        .select("*")\
        .eq("id", habit_id)\
        .execute()
    
    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Daily habit not found")
    
    habit = habit_res.data[0]
    now = datetime.now(timezone.utc)
    
    last_completed_str = habit.get("last_completed_at")
    current_streak = habit.get("streak", 0)
    
    # last_completed_at をパース
    last_completed: datetime | None = None
    if last_completed_str:
        try:
            last_completed = datetime.fromisoformat(
                last_completed_str.replace('Z', '+00:00')
            )
        except ValueError:
            last_completed = None
    
    # --- トグルロジック ---
    healed_amount = 0.0

    if last_completed and is_same_day(last_completed, now):
        # 今日すでに完了 → キャンセル処理
        new_streak = max(0, current_streak - 1)

        # last_completed_at を戻す（前日があれば前日、なければnull）
        # 簡略化: 今回はnullに戻す（厳密な履歴管理は別途テーブルが必要）
        new_last_completed = None

        update_data = {
            "streak": new_streak,
            "last_completed_at": new_last_completed
        }

        action = "unchecked"
        message = f"習慣をキャンセルしました。ストリーク: {new_streak}日"
    else:
        # 今日まだ → 完了処理
        if last_completed and is_yesterday(last_completed):
            # 昨日も完了していた → ストリーク継続
            new_streak = current_streak + 1
        else:
            # 連続途切れ or 初完了 → ストリークリセット
            new_streak = 1

        update_data = {
            "streak": new_streak,
            "last_completed_at": now.isoformat()
        }

        action = "checked"
        message = f"🔥 {new_streak}日連続達成！" if new_streak > 1 else "習慣を完了しました！"

        # HP回復処理（完了時のみ）
        user_id = habit["user_id"]

        # ユーザーのアクティブなペットを取得
        pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()

        if pet_res.data:
            pet_data = pet_res.data[0]

            # 減衰を適用
            decayed_pet = calculate_time_decay(pet_data)

            heal_amount = 10.0
            new_mood = min(100.0, float(decayed_pet.get('mood', 50)) + 15.0)
            new_corruption = max(0, int(decayed_pet.get('infection_level', 0)) - 10)
            new_care_score = update_care_score(float(decayed_pet.get('care_score', 50)), 'habit_complete')

            if decayed_pet['status'] == 'ALIVE':
                new_hp = min(float(decayed_pet['max_hp']), decayed_pet['hp'] + heal_amount)
                decayed_pet['hp'] = new_hp
                healed_amount = heal_amount

            pet_update = {
                "hp": decayed_pet['hp'],
                "status": decayed_pet['status'],
                "mood": new_mood,
                "infection_level": new_corruption,
                "care_score": new_care_score,
                "last_checked_at": datetime.now(timezone.utc).isoformat()
            }

            client.table("pets").update(pet_update).eq("id", pet_data['id']).execute()

    # DB更新
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
def delete_habit(habit_id: str):
    """
    日次習慣を削除する。
    """
    # 存在確認
    habit_res = client.table("daily_habits")\
        .select("id")\
        .eq("id", habit_id)\
        .execute()
    
    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Daily habit not found")
    
    # 削除実行
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
