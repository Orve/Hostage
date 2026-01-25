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
        "last_checked_at": "now()", # Supabase側で処理、または文字列を渡す
        "character_type": pet_in.character_type
    }
    
    
    # Check if user profile exists
    user_check = client.table("profiles").select("id").eq("id", pet_in.user_id).execute()
    
    if not user_check.data:
        # Auto-create profile for development/testing ease
        # In production, this should ideally be handled by Supabase Auth triggers
        # In production, this should ideally be handled by Supabase Auth triggers
        # print(f"Creating missing profile for user: {pet_in.user_id}")
        client.table("profiles").insert({"id": str(pet_in.user_id)}).execute()

    response = client.table("pets").insert(new_pet).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create pet")
        
    return response.data[0]

@router.get("/{user_id}", response_model=PetResponse)
def get_pet_status(user_id: str):
    # ペット取得 (修正: DEADなペットも取得して表示する)
    # まずALIVEなペットを探す
    response = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()
    
    pet_data = None
    if response.data:
        pet_data = response.data[0]
    else:
        # ALIVEがいなければ、最新のDEADなペットを探す (The Missing Corpse Fix)
        dead_res = client.table("pets").select("*").eq("user_id", user_id).eq("status", "DEAD").order("created_at", desc=True).limit(1).execute()
        if dead_res.data:
            pet_data = dead_res.data[0]
        else:
            # 本当に何もいない場合のみ404
            raise HTTPException(status_code=404, detail="Active pet not found")
    
    # 減衰状態の計算（非永続）
    current_state = calculate_time_decay(pet_data)
    
    return current_state


@router.post("/{pet_id}/revive", response_model=PetResponse)
def revive_pet(pet_id: str):
    """
    Pet Revival Protocol
    - HP reset to 100
    - Status set to ALIVE
    - Infection level reset to 0
    - Last interaction updated
    """
    # 現在のペットを確認
    current_pet = client.table("pets").select("*").eq("id", pet_id).execute()
    if not current_pet.data:
        raise HTTPException(status_code=404, detail="Pet not found")

    # 更新データ
    revive_data = {
        "status": "ALIVE",
        "hp": 100.0,
        "infection_level": 0,
        "last_checked_at": "now()"
    }

    # DB更新
    response = client.table("pets").update(revive_data).eq("id", pet_id).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to revive pet")

    return response.data[0]


@router.delete("/me", status_code=204)
def purge_mypet(user_id: str):
    """
    [Purge Protocol]
    Deletes the user's pet data permanently.
    This allows the user to start over with a new specimen.
    """
    client.table("pets").delete().eq("user_id", user_id).execute()
    return None

