from datetime import datetime, timezone
from typing import Dict, Any

DECAY_COEFFICIENT = 0.5

# 飢餓度: 1時間で +2 (50時間でMAX)
HUNGER_RATE_PER_HOUR = 2.0
# 機嫌度: 1時間で -1 (100時間でMIN)
MOOD_DECAY_PER_HOUR = 1.0
# 腐敗度: 毎日cronで習慣未達成ごとに加算（routers側で処理）
# care_score更新レート
CARE_SCORE_ALPHA = 0.1  # 指数移動平均のスムージング係数


def calculate_time_decay(pet: Dict[str, Any]) -> Dict[str, Any]:
    """
    経過時間に基づいてHP・飢餓度・機嫌度を計算する。
    DBには保存しない（表示用計算のみ）。
    """
    if pet['status'] == 'DEAD':
        return pet

    last_checked_str = pet.get('last_checked_at')
    if not last_checked_str:
        return pet

    try:
        last_checked = datetime.fromisoformat(last_checked_str.replace('Z', '+00:00'))
    except ValueError:
        return pet

    now = datetime.now(timezone.utc)
    hours_passed = (now - last_checked).total_seconds() / 3600.0

    if hours_passed <= 0:
        return pet

    updated_pet = pet.copy()

    # 飢餓度: 時間で上昇（上限100）
    current_hunger = float(pet.get('hunger', 0))
    new_hunger = min(100.0, current_hunger + HUNGER_RATE_PER_HOUR * hours_passed)
    updated_pet['hunger'] = new_hunger

    # 機嫌度: 時間で低下（下限0）
    current_mood = float(pet.get('mood', 50))
    new_mood = max(0.0, current_mood - MOOD_DECAY_PER_HOUR * hours_passed)
    updated_pet['mood'] = new_mood

    # HP減衰: 飢餓が高いほど加速
    hunger_multiplier = 1.0 + (new_hunger / 100.0)
    damage = (hours_passed ** 2) * DECAY_COEFFICIENT * hunger_multiplier

    # 機嫌が高いと微回復ボーナス
    regen = (new_mood / 200.0) * hours_passed

    current_hp = float(pet.get('hp', 100))
    new_hp = max(0.0, min(float(pet.get('max_hp', 100)), current_hp - damage + regen))
    updated_pet['hp'] = new_hp

    if new_hp <= 0:
        updated_pet['status'] = 'DEAD'

    return updated_pet


def calculate_evolution(pet: Dict[str, Any]) -> Dict[str, Any]:
    """
    生存日数とcare_scoreから進化ステージとパスを決定する。
    """
    born_at_str = pet.get('born_at')
    if not born_at_str:
        return pet

    try:
        born_at = datetime.fromisoformat(born_at_str.replace('Z', '+00:00'))
    except ValueError:
        return pet

    days_alive = (datetime.now(timezone.utc) - born_at).total_seconds() / 86400.0
    care_score = float(pet.get('care_score', 50))
    current_stage = int(pet.get('evolution_stage', 0))
    current_path = pet.get('evolution_path')

    # ステージ決定（後退なし）
    if days_alive < 1:
        new_stage = 0
    elif days_alive < 3:
        new_stage = 1
    elif days_alive < 7:
        new_stage = 2
    elif days_alive < 14:
        new_stage = 3
    else:
        new_stage = 4

    new_stage = max(current_stage, new_stage)

    # パス確定（stage >= 3 で一度決まったら変わらない）
    new_path = current_path
    if new_stage >= 3 and current_path is None:
        new_path = 'light' if care_score >= 50 else 'dark'

    updated = pet.copy()
    updated['evolution_stage'] = new_stage
    updated['evolution_path'] = new_path
    return updated


def update_care_score(current_score: float, event: str) -> float:
    """
    イベントに応じてcare_scoreを指数移動平均で更新する。
    event: 'task_complete' | 'habit_complete' | 'task_overdue' | 'habit_missed'
    """
    event_values = {
        'task_complete': 70,
        'habit_complete': 80,
        'task_overdue': 20,
        'habit_missed': 30,
    }
    target = event_values.get(event, 50)
    return current_score * (1 - CARE_SCORE_ALPHA) + target * CARE_SCORE_ALPHA
