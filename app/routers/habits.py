from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import HabitComplete, PetResponse
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
from app.core.auth import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/habits", tags=["habits"])


@router.post("/complete", response_model=PetResponse)
def complete_habit(payload: HabitComplete, current_user: str = Depends(get_current_user)):
    habit_res = client.table("habits").select("user_id").eq("id", str(payload.habit_id)).execute()
    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit_owner = str(habit_res.data[0]['user_id'])
    if habit_owner != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your habit")

    pet_res = client.table("pets").select("*").eq("user_id", current_user).eq("status", "ALIVE").execute()
    if not pet_res.data:
        raise HTTPException(status_code=404, detail="Active pet not found")

    pet_data = pet_res.data[0]
    decayed_pet = calculate_time_decay(pet_data)

    HEAL_AMOUNT = 10.0

    if decayed_pet['status'] == 'ALIVE':
        new_hp = min(float(decayed_pet['max_hp']), decayed_pet['hp'] + HEAL_AMOUNT)
        decayed_pet['hp'] = new_hp

    update_data = {
        "hp": decayed_pet['hp'],
        "status": decayed_pet['status'],
        "last_checked_at": datetime.now(timezone.utc).isoformat()
    }

    update_res = client.table("pets").update(update_data).eq("id", pet_data['id']).execute()

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update pet")

    return update_res.data[0]
