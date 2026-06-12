from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import PetCreate, PetResponse
from app.services.supabase import client
from app.services.game_logic import calculate_time_decay
from app.core.auth import get_current_user

router = APIRouter(prefix="/pets", tags=["pets"])


@router.post("/", response_model=PetResponse)
def create_pet(pet_in: PetCreate, current_user: str = Depends(get_current_user)):
    new_pet = {
        "user_id": current_user,
        "name": pet_in.name,
        "hp": 40.0,
        "max_hp": 100.0,
        "infection_level": 0,
        "status": "ALIVE",
        "last_checked_at": "now()",
        "character_type": pet_in.character_type
    }

    user_check = client.table("profiles").select("id").eq("id", current_user).execute()
    if not user_check.data:
        client.table("profiles").insert({"id": current_user}).execute()

    response = client.table("pets").insert(new_pet).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create pet")

    return response.data[0]


@router.get("/me", response_model=PetResponse)
def get_pet_status(current_user: str = Depends(get_current_user)):
    response = client.table("pets").select("*").eq("user_id", current_user).eq("status", "ALIVE").execute()

    pet_data = None
    if response.data:
        pet_data = response.data[0]
    else:
        dead_res = client.table("pets").select("*").eq("user_id", current_user).eq("status", "DEAD").order("last_checked_at", desc=True).limit(1).execute()
        if dead_res.data:
            pet_data = dead_res.data[0]
        else:
            raise HTTPException(status_code=404, detail="Active pet not found")

    return calculate_time_decay(pet_data)


@router.post("/{pet_id}/revive", response_model=PetResponse)
def revive_pet(pet_id: str, current_user: str = Depends(get_current_user)):
    """
    Pet Revival Protocol
    - HP reset to 100
    - Status set to ALIVE
    - Infection level reset to 0
    """
    current_pet = client.table("pets").select("*").eq("id", pet_id).execute()
    if not current_pet.data:
        raise HTTPException(status_code=404, detail="Pet not found")

    if str(current_pet.data[0]["user_id"]) != current_user:
        raise HTTPException(status_code=403, detail="Forbidden: not your pet")

    revive_data = {
        "status": "ALIVE",
        "hp": 100.0,
        "infection_level": 0,
        "last_checked_at": "now()"
    }

    response = client.table("pets").update(revive_data).eq("id", pet_id).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to revive pet")

    return response.data[0]


@router.delete("/me", status_code=204)
def purge_mypet(current_user: str = Depends(get_current_user)):
    """
    [Purge Protocol]
    Deletes the authenticated user's pet data permanently.
    """
    client.table("pets").delete().eq("user_id", current_user).execute()
    return None
