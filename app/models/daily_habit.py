"""
日次習慣管理のPydanticモデル

ストリーク追跡機能を持つ習慣のCRUD操作で使用するスキーマを定義。
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


class DailyHabitBase(BaseModel):
    """日次習慣の基本スキーマ"""
    title: str = Field(..., min_length=1, max_length=100, description="習慣名")


class DailyHabitCreate(DailyHabitBase):
    """日次習慣作成リクエスト"""
    user_id: str = Field(..., description="ユーザーID")


class DailyHabitResponse(DailyHabitBase):
    """日次習慣レスポンス"""
    id: UUID
    user_id: UUID
    streak: int = Field(default=0, description="連続達成日数")
    last_completed_at: Optional[datetime] = Field(
        default=None,
        description="最終完了日時"
    )
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic V2 compatibility


class DailyHabitListResponse(BaseModel):
    """日次習慣一覧レスポンス"""
    habits: list[DailyHabitResponse]
    total: int


class DailyHabitCheckResponse(BaseModel):
    """習慣チェック（完了/未完了トグル）レスポンス"""
    habit: DailyHabitResponse
    action: str = Field(..., description="'checked' または 'unchecked'")
    new_streak: int
    message: str
