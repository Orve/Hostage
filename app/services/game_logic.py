from datetime import datetime, timezone
from typing import Dict, Any

# 減衰式: ダメージ = (経過時間 ^ 2) * 係数
DECAY_COEFFICIENT = 0.5 

def calculate_time_decay(pet: Dict[str, Any]) -> Dict[str, Any]:
    """
    last_checked_at からの経過時間に基づいてペットの現在の状態を計算します。
    更新されたペットの状態の辞書を返します（DBには保存されません）。
    """
    if pet['status'] == 'DEAD':
        return pet

    # Supabase JSONからのタイムスタンプ文字列用パーサー
    last_checked_str = pet.get('last_checked_at')
    if not last_checked_str:
        return pet # DBが正常なら発生しないはず

    try:
        last_checked = datetime.fromisoformat(last_checked_str.replace('Z', '+00:00'))
    except ValueError:
        # フォーマットエラー時のフォールバック
        return pet 

    now = datetime.now(timezone.utc)
    diff = now - last_checked
    hours_passed = diff.total_seconds() / 3600.0

    if hours_passed <= 0:
        return pet

    # 指数関数的なダメージ計算
    damage = (hours_passed ** 2) * DECAY_COEFFICIENT
    
    # ダメージ適用
    current_hp = float(pet.get('hp', 100))
    new_hp = max(0.0, current_hp - damage)
    
    # 複製して更新
    updated_pet = pet.copy()
    updated_pet['hp'] = new_hp
    
    if new_hp <= 0:
        updated_pet['status'] = 'DEAD'
        # 感染レベルMAX? または単に死亡扱い
    
    # 注: ここで 'last_checked_at' は更新しません（永続化する場合のみ更新）。
    # これは単に「どうなるか」を表示するだけです。
    
    return updated_pet
