"""
タスク管理APIエンドポイント

ユーザーがネイティブタスクを作成・完了・取得するためのAPI。
Notionに依存せず、独自のタスク管理を提供する。

【ダメージシステム】
- 継続ダメージ型: 期限切れタスクは毎日ダメージを与え続ける
- 7日以上経過したタスクは自動削除
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime, timezone
from uuid import UUID
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
from app.core.auth import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/tasks", tags=["tasks"])


# --- ダメージシステム定数 ---
DAMAGE_RULES = {
    1: 5,
    3: 10,
    7: 20
}

PRIORITY_MULTIPLIER = {
    "low": 1.0,
    "medium": 1.5,
    "high": 2.0,
    "critical": 3.0
}


def calculate_overdue_damage(days_overdue: int, priority: str) -> float:
    base_damage = 0
    if days_overdue >= 7:
        base_damage = DAMAGE_RULES[7]
    elif days_overdue >= 3:
        base_damage = DAMAGE_RULES[3]
    elif days_overdue >= 1:
        base_damage = DAMAGE_RULES[1]

    if base_damage == 0:
        return 0.0

    multiplier = PRIORITY_MULTIPLIER.get(priority, 1.0)
    return base_damage * multiplier


# --- スキーマ定義 ---
class TaskCreate(BaseModel):
    user_id: Optional[str] = None  # 廃止予定: サーバー側でJWTから導出
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Literal['low', 'medium', 'high', 'critical'] = 'medium'
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    source: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]


class TaskComplete(BaseModel):
    task_id: str


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int


# --- エンドポイント ---
@router.post("/", response_model=TaskResponse)
def create_task(task_in: TaskCreate, current_user: str = Depends(get_current_user)):
    new_task = {
        "user_id": current_user,
        "title": task_in.title,
        "description": task_in.description,
        "priority": task_in.priority,
        "source": "native",
        "completed": False,
    }

    if task_in.due_date:
        new_task["due_date"] = task_in.due_date.isoformat()

    response = client.table("tasks").insert(new_task).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create task")

    created_task = response.data[0]

    habit_data = {
        "user_id": current_user,
        "title": task_in.title,
        "frequency": "ONCE",
        "source": "native",
        "task_id": created_task["id"],
    }

    habit_response = client.table("habits").insert(habit_data).execute()

    if not habit_response.data:
        client.table("tasks").delete().eq("id", created_task["id"]).execute()
        raise HTTPException(status_code=400, detail="Failed to create associated habit")

    return created_task


@router.get("/", response_model=TaskListResponse)
def get_user_tasks(
    completed: Optional[bool] = None,
    limit: int = 50,
    current_user: str = Depends(get_current_user)
):
    query = client.table("tasks").select("*").eq("user_id", current_user)

    if completed is not None:
        query = query.eq("completed", completed)

    query = query.order("created_at", desc=True).limit(limit)
    response = query.execute()

    if not response.data:
        return {"tasks": [], "total": 0}

    return {"tasks": response.data, "total": len(response.data)}


@router.post("/complete", response_model=dict)
def complete_task(payload: TaskComplete, current_user: str = Depends(get_current_user)):
    task_res = client.table("tasks").select("*").eq("id", payload.task_id).execute()

    if not task_res.data:
        raise HTTPException(status_code=404, detail="Task not found")

    task = task_res.data[0]

    if str(task["user_id"]) != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your task")

    if task["completed"]:
        raise HTTPException(status_code=400, detail="Task already completed")

    user_id = task["user_id"]

    pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()

    if not pet_res.data:
        raise HTTPException(status_code=404, detail="Active pet not found")

    pet_data = pet_res.data[0]
    decayed_pet = calculate_time_decay(pet_data)

    heal_amounts = {
        "low": 3.0,
        "medium": 5.0,
        "high": 8.0,
        "critical": 12.0,
    }
    heal_amount = heal_amounts.get(task["priority"], 5.0)

    if decayed_pet['status'] == 'ALIVE':
        new_hp = min(float(decayed_pet['max_hp']), decayed_pet['hp'] + heal_amount)
        decayed_pet['hp'] = new_hp

    pet_update = {
        "hp": decayed_pet['hp'],
        "status": decayed_pet['status'],
        "last_checked_at": datetime.now(timezone.utc).isoformat()
    }

    pet_update_res = client.table("pets").update(pet_update).eq("id", pet_data['id']).execute()

    if not pet_update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update pet")

    task_update = {
        "completed": True,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }

    task_update_res = client.table("tasks").update(task_update).eq("id", payload.task_id).execute()

    if not task_update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update task")

    return {
        "status": "completed",
        "task": task_update_res.data[0],
        "pet": pet_update_res.data[0],
        "healed": heal_amount,
        "message": f"Task completed! Healed {heal_amount} HP"
    }


@router.delete("/{task_id}")
def delete_task(task_id: str, current_user: str = Depends(get_current_user)):
    task_res = client.table("tasks").select("id", "user_id").eq("id", task_id).execute()

    if not task_res.data:
        raise HTTPException(status_code=404, detail="Task not found")

    if str(task_res.data[0]["user_id"]) != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your task")

    delete_res = client.table("tasks").delete().eq("id", task_id).execute()

    if not delete_res.data:
        raise HTTPException(status_code=500, detail="Failed to delete task")

    return {"status": "deleted", "task_id": task_id}


# ========== ダメージシステム エンドポイント ==========

@router.get("/overdue")
def get_overdue_tasks(current_user: str = Depends(get_current_user)):
    now = datetime.now(timezone.utc)

    response = client.table("tasks").select("*")\
        .eq("user_id", current_user)\
        .eq("completed", False)\
        .not_.is_("due_date", "null")\
        .execute()

    tasks = response.data or []
    overdue_list = []
    total_damage = 0.0

    for task in tasks:
        due_date_str = task.get("due_date")
        if not due_date_str:
            continue

        try:
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
        except ValueError:
            continue

        if due_date < now:
            delta = now - due_date
            days_overdue = delta.days

            dmg = calculate_overdue_damage(days_overdue, task.get("priority", "medium"))

            if dmg > 0:
                overdue_list.append({
                    "id": task["id"],
                    "title": task["title"],
                    "due_date": task["due_date"],
                    "days_overdue": days_overdue,
                    "priority": task.get("priority", "medium"),
                    "potential_damage": dmg
                })
                total_damage += dmg

    return {
        "overdue_tasks": overdue_list,
        "total_potential_damage": total_damage,
        "warning_message": f"⚠ {len(overdue_list)} OVERDUE TASKS DETECTED" if overdue_list else None
    }


@router.get("/cron/damage")
def apply_daily_damage(
    x_api_key: str = Header(..., alias="X-API-KEY")
):
    """
    【CRON用】全ユーザーのダメージ計算＆適用

    セキュリティ: X-API-KEY ヘッダーで認証（CRON_SECRET 環境変数必須）
    注意: Vercel CronはGETリクエストを送信するため、GETで実装。
    """
    if x_api_key != settings.CRON_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid API Key")

    now = datetime.now(timezone.utc)

    pets_res = client.table("pets").select("*").in_("status", ["ALIVE", "CRITICAL"]).execute()
    pets = pets_res.data or []

    report = {
        "status": "completed",
        "processed_pets": 0,
        "total_damage_dealt": 0.0,
        "pets_killed": 0,
        "tasks_deleted": 0,
        "details": []
    }

    for pet in pets:
        user_id = pet["user_id"]

        tasks_res = client.table("tasks").select("*")\
            .eq("user_id", user_id)\
            .eq("completed", False)\
            .not_.is_("due_date", "null")\
            .execute()

        tasks = tasks_res.data or []
        if not tasks:
            continue

        total_pet_damage = 0.0
        overdue_count = 0

        for task in tasks:
            due_date_str = task.get("due_date")
            if not due_date_str:
                continue

            try:
                due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
            except ValueError:
                continue

            if due_date >= now:
                continue

            days_overdue = (now - due_date).days
            dmg = calculate_overdue_damage(days_overdue, task.get("priority", "medium"))

            if days_overdue >= 7:
                client.table("tasks").delete().eq("id", task["id"]).execute()
                report["tasks_deleted"] += 1

            total_pet_damage += dmg
            if dmg > 0:
                overdue_count += 1

        if total_pet_damage > 0:
            new_hp = max(0, pet["hp"] - total_pet_damage)
            new_status = pet["status"]

            if new_hp <= 0:
                new_status = "DEAD"
                report["pets_killed"] += 1

            client.table("pets").update({
                "hp": new_hp,
                "status": new_status,
                "last_checked_at": now.isoformat()
            }).eq("id", pet["id"]).execute()

            report["details"].append({
                "user_id": user_id,
                "pet_name": pet["name"],
                "damage": total_pet_damage,
                "new_hp": new_hp,
                "status": new_status,
                "overdue_tasks": overdue_count
            })

            report["total_damage_dealt"] += total_pet_damage
            report["processed_pets"] += 1

    return report
