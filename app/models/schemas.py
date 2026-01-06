from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

# --- ペットモデル ---
class PetBase(BaseModel):
    name: str = Field(..., max_length=50)

class PetCreate(PetBase):
    user_id: UUID

class PetResponse(PetBase):
    id: UUID
    user_id: UUID
    hp: float
    max_hp: float
    infection_level: int
    status: Literal['ALIVE', 'DEAD']
    last_checked_at: datetime
    born_at: datetime

# --- 習慣モデル ---
class HabitCreate(BaseModel):
    user_id: UUID
    title: str
    frequency: str = "DAILY"

class HabitComplete(BaseModel):
    habit_id: str # UUID strictness check relax
