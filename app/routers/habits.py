from fastapi import APIRouter, HTTPException
from app.models.schemas import HabitComplete, PetResponse
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
from datetime import datetime, timezone

router = APIRouter(prefix="/habits", tags=["habits"])

@router.post("/complete", response_model=PetResponse)
def complete_habit(payload: HabitComplete):
    # 1. 習慣の取得と所有権の確認 (MVPのため省略、有効なIDと仮定)
    
    # 2. ユーザーのアクティブなペットを取得
    # ペイロードには habit_id しかないため、まず習慣を取得して所有者を特定
    habit_res = client.table("habits").select("user_id").eq("id", str(payload.habit_id)).execute()
    if not habit_res.data:
        raise HTTPException(status_code=404, detail="Habit not found")
        
    user_id = habit_res.data[0]['user_id']
    
    pet_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    if not pet_res.data:
         raise HTTPException(status_code=404, detail="Active pet not found")
         
    pet_data = pet_res.data[0]
    
    # 3. まず累積した減衰を適用
    decayed_pet = calculate_time_decay(pet_data)
    
    # 4. 回復の適用
    HEAL_AMOUNT = 10.0
    
    if decayed_pet['status'] == 'ALIVE':
        new_hp = min(float(decayed_pet['max_hp']), decayed_pet['hp'] + HEAL_AMOUNT)
        decayed_pet['hp'] = new_hp
        
    # 5. 更新のコミット (減衰 + 回復) + last_checked_at の更新
    update_data = {
        "hp": decayed_pet['hp'],
        "status": decayed_pet['status'],
        "last_checked_at": datetime.now(timezone.utc).isoformat()
    }
    
    update_res = client.table("pets").update(update_data).eq("id", pet_data['id']).execute()
    
    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to update pet")
        
    return update_res.data[0]
