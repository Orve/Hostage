from fastapi import APIRouter, HTTPException
from app.models.schemas import PetCreate, PetResponse
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
import uuid

router = APIRouter(prefix="/pets", tags=["pets"])

@router.post("/", response_model=PetResponse)
def create_pet(pet_in: PetCreate):
    # データ準備
    new_pet = {
        "user_id": str(pet_in.user_id),
        "name": pet_in.name,
        "hp": 100.0,
        "max_hp": 100.0,
        "infection_level": 0,
        "status": "ALIVE",
        "last_checked_at": "now()" # Supabase側で処理、または文字列を渡す
    }
    
    response = client.table("pets").insert(new_pet).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create pet")
        
    return response.data[0]

@router.get("/{user_id}", response_model=PetResponse)
def get_pet_status(user_id: str):
    # ペット取得
    response = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    
    if not response.data:
        # 死んだペットがいるかチェック？ または単に404を返す
        # MVPではユーザーにつきアクティブなペットは1匹と仮定
        raise HTTPException(status_code=404, detail="Active pet not found")
        
    pet_data = response.data[0]
    
    # 減衰状態の計算（非永続）
    current_state = calculate_time_decay(pet_data)
    
    return current_state
