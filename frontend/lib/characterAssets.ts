export type CharacterHealthState = 'healthy' | 'caution' | 'danger' | 'dead';
export type CharacterType = 'cyber-fairy' | 'bio-mutant' | 'void-geometry';
export type EvolutionPath = 'light' | 'dark' | null;

export const HP_THRESHOLDS = {
  HEALTHY_MIN: 80,
  CAUTION_MIN: 50,
  DANGER_MIN: 20,
} as const;

// 進化ステージごとのビジュアルエフェクト（CSS filter）
export const EVOLUTION_EFFECTS: Record<string, string> = {
  '0':       'blur(3px) brightness(0.5) saturate(0)',      // 卵: 暗くぼんやり
  '1':       'brightness(0.85) saturate(0.7)',             // 幼体: やや暗い
  '2':       'none',                                        // 成体: 通常
  '3_light': 'brightness(1.25) drop-shadow(0 0 10px #ffd700)',  // 覚醒: ゴールドオーラ
  '3_dark':  'saturate(0.25) hue-rotate(280deg) contrast(1.3)', // 腐敗: 紫がかった
  '4_light': 'brightness(1.4) drop-shadow(0 0 24px #fff) saturate(1.5)', // 最終形・光
  '4_dark':  'saturate(0) contrast(1.6) hue-rotate(280deg) brightness(0.7)', // 最終形・闇
};

// 腐敗度によるオーバーレイ不透明度（0-1）
export function getCorruptionOverlayOpacity(corruption: number): number {
  return Math.min(corruption / 100, 0.6);
}

// 進化ステージのエフェクトキーを生成
export function getEvolutionEffectKey(stage: number, path: EvolutionPath): string {
  if (stage >= 3 && path) return `${stage}_${path}`;
  return String(Math.min(stage, 2));
}

export function getEvolutionFilter(stage: number, path: EvolutionPath): string {
  const key = getEvolutionEffectKey(stage, path);
  return EVOLUTION_EFFECTS[key] ?? 'none';
}

// 進化ステージ名（表示用）
export const EVOLUTION_STAGE_NAMES: Record<string, { ja: string; en: string }> = {
  '0':       { ja: '卵',         en: 'EGG' },
  '1':       { ja: '幼体',       en: 'LARVA' },
  '2':       { ja: '成体',       en: 'ADULT' },
  '3_light': { ja: '覚醒体',     en: 'AWAKENED' },
  '3_dark':  { ja: '腐敗体',     en: 'CORRUPTED' },
  '4_light': { ja: '最終形・光', en: 'FINAL FORM [LIGHT]' },
  '4_dark':  { ja: '最終形・闇', en: 'FINAL FORM [DARK]' },
};

export function getEvolutionStageName(stage: number, path: EvolutionPath, lang: 'ja' | 'en' = 'ja'): string {
  const key = getEvolutionEffectKey(stage, path);
  return EVOLUTION_STAGE_NAMES[key]?.[lang] ?? `STAGE ${stage}`;
}

export function getCharacterHealthState(hp: number): CharacterHealthState {
  if (hp >= HP_THRESHOLDS.HEALTHY_MIN) return 'healthy';
  if (hp >= HP_THRESHOLDS.CAUTION_MIN) return 'caution';
  if (hp >= HP_THRESHOLDS.DANGER_MIN) return 'danger';
  return 'dead';
}

export function getCharacterImagePath(
  characterType: CharacterType,
  status: CharacterHealthState
): string {
  return `/assets/characters/${characterType}/${status}.png`;
}

export function getCharacterImagePathFromHp(
  characterType: CharacterType,
  hp: number
): string {
  const state = getCharacterHealthState(hp);
  return getCharacterImagePath(characterType, state);
}

export function getCharacterImageByStatus(
  characterType: CharacterType,
  hp: number,
  status: 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED'
): string {
  if (status === 'DEAD') return getCharacterImagePath(characterType, 'dead');
  if (status === 'UNINITIALIZED') return getCharacterImagePath(characterType, 'healthy');
  return getCharacterImagePathFromHp(characterType, hp);
}

export function getAllCharacterImages(characterType: CharacterType): string[] {
  const states: CharacterHealthState[] = ['healthy', 'caution', 'danger', 'dead'];
  return states.map(state => getCharacterImagePath(characterType, state));
}

export const DEFAULT_CHARACTER_TYPE: CharacterType = 'cyber-fairy';
