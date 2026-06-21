from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

# --- ペットモデル ---
class PetBase(BaseModel):
    name: str = Field(..., max_length=50)
    character_type: str = "cyber-fairy"

class PetCreate(PetBase):
    user_id: UUID

class PetResponse(PetBase):
    id: UUID
    user_id: UUID
    hp: float
    max_hp: float
    infection_level: int  # 腐敗度 (0-100)
    hunger: float = 0.0
    mood: float = 50.0
    evolution_stage: int = 0
    evolution_path: Optional[str] = None
    care_score: float = 50.0
    status: Literal['ALIVE', 'DEAD']
    last_checked_at: datetime
    born_at: datetime
    character_type: str

# --- 習慣モデル ---
class HabitCreate(BaseModel):
    user_id: UUID
    title: str
    frequency: str = "DAILY"

class HabitComplete(BaseModel):
    habit_id: str # UUID strictness check relax
