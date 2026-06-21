from fastapi import APIRouter, HTTPException
from app.models.schemas import PetCreate, PetResponse
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay, calculate_evolution

router = APIRouter(prefix="/pets", tags=["pets"])

@router.post("/", response_model=PetResponse)
def create_pet(pet_in: PetCreate):
    new_pet = {
        "user_id": str(pet_in.user_id),
        "name": pet_in.name,
        "hp": 40.0,
        "max_hp": 100.0,
        "infection_level": 0,
        "hunger": 0.0,
        "mood": 50.0,
        "evolution_stage": 0,
        "evolution_path": None,
        "care_score": 50.0,
        "status": "ALIVE",
        "last_checked_at": "now()",
        "character_type": pet_in.character_type
    }

    user_check = client.table("profiles").select("id").eq("id", pet_in.user_id).execute()
    if not user_check.data:
        client.table("profiles").insert({"id": str(pet_in.user_id)}).execute()

    response = client.table("pets").insert(new_pet).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create pet")

    return response.data[0]


@router.get("/{user_id}", response_model=PetResponse)
def get_pet_status(user_id: str):
    response = client.table("pets").select("*").eq("user_id", user_id).eq("status", "ALIVE").execute()

    pet_data = None
    if response.data:
        pet_data = response.data[0]
    else:
        dead_res = (
            client.table("pets")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "DEAD")
            .order("last_checked_at", desc=True)
            .limit(1)
            .execute()
        )
        if dead_res.data:
            pet_data = dead_res.data[0]
        else:
            raise HTTPException(status_code=404, detail="Active pet not found")

    # 経過時間による各パラメータ更新（非永続）
    current_state = calculate_time_decay(pet_data)

    # 進化ステージ計算（変化があればDB更新）
    evolved_state = calculate_evolution(current_state)
    if (evolved_state['evolution_stage'] != pet_data.get('evolution_stage')
            or evolved_state['evolution_path'] != pet_data.get('evolution_path')):
        client.table("pets").update({
            "evolution_stage": evolved_state['evolution_stage'],
            "evolution_path": evolved_state['evolution_path'],
        }).eq("id", pet_data['id']).execute()

    return evolved_state


@router.post("/{pet_id}/revive", response_model=PetResponse)
def revive_pet(pet_id: str):
    current_pet = client.table("pets").select("*").eq("id", pet_id).execute()
    if not current_pet.data:
        raise HTTPException(status_code=404, detail="Pet not found")

    revive_data = {
        "status": "ALIVE",
        "hp": 100.0,
        "infection_level": 0,
        "hunger": 0.0,
        "mood": 50.0,
        "care_score": 50.0,
        "evolution_stage": 0,
        "evolution_path": None,
        "last_checked_at": "now()"
    }

    response = client.table("pets").update(revive_data).eq("id", pet_id).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to revive pet")

    return response.data[0]


@router.delete("/me", status_code=204)
def purge_mypet(user_id: str):
    client.table("pets").delete().eq("user_id", user_id).execute()
    return None
