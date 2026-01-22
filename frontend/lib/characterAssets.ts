// frontend/lib/characterAssets.ts
// キャラクターアセット管理モジュール
// HPに応じた動的画像切り替えロジックを提供

/**
 * キャラクターのHP状態を表す型
 * 画像ファイル名と1対1で対応
 */
export type CharacterHealthState = 'healthy' | 'caution' | 'danger' | 'dead';

/**
 * キャラクタータイプの定義
 * 将来的に新キャラクターを追加する際はここに追加
 */
export type CharacterType = 'cyber-fairy' | 'bio-mutant' | 'synth-android';

/**
 * HP閾値の設定
 * 各状態の境界値を一元管理（調整が必要な場合はここを変更）
 */
const HP_THRESHOLDS = {
  HEALTHY_MIN: 80,  // 80-100: Healthy (正常な発光状態)
  CAUTION_MIN: 50,  // 50-79:  Caution (軽微なグリッチ、困り顔)
  DANGER_MIN: 20,   // 20-49:  Danger (深刻な侵食、赤色のノイズ)
  // 0-19: Dead (グレーアウト、石化・崩壊)
} as const;

/**
 * HPからキャラクター状態を判定する
 * @param hp - 現在のHP (0-100)
 * @returns 該当するCharacterHealthState
 */
export function getCharacterHealthState(hp: number): CharacterHealthState {
  if (hp >= HP_THRESHOLDS.HEALTHY_MIN) return 'healthy';
  if (hp >= HP_THRESHOLDS.CAUTION_MIN) return 'caution';
  if (hp >= HP_THRESHOLDS.DANGER_MIN) return 'danger';
  return 'dead';
}

/**
 * キャラクター画像のパスを生成する
 * @param characterType - キャラクタータイプ (例: 'cyber-fairy')
 * @param hp - 現在のHP (0-100)
 * @returns 画像の公開パス
 */
export function getCharacterImagePath(
  characterType: CharacterType,
  hp: number
): string {
  const state = getCharacterHealthState(hp);
  return `/assets/characters/${characterType}/${state}.png`;
}

/**
 * ステータス文字列から画像パスを取得
 * 既存のStasisChamberPropsのstatusと互換性を持たせるための関数
 * @param characterType - キャラクタータイプ
 * @param hp - 現在のHP
 * @param status - 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED'
 * @returns 画像の公開パス
 */
export function getCharacterImageByStatus(
  characterType: CharacterType,
  hp: number,
  status: 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED'
): string {
  // DEADステータスは直接dead画像を返す（HPに関わらず）
  if (status === 'DEAD') {
    return `/assets/characters/${characterType}/dead.png`;
  }

  // UNINITIALIZEDはhealthy（デフォルト/プレビュー表示）を返す
  if (status === 'UNINITIALIZED') {
    return `/assets/characters/${characterType}/healthy.png`;
  }

  // ALIVE/CRITICALはHPに基づいて判定
  return getCharacterImagePath(characterType, hp);
}

/**
 * すべてのキャラクター画像を事前読み込み用にリストアップ
 * 画像の遅延読み込みを防ぐために使用
 * @param characterType - キャラクタータイプ
 * @returns すべての状態の画像パス配列
 */
export function getAllCharacterImages(characterType: CharacterType): string[] {
  const states: CharacterHealthState[] = ['healthy', 'caution', 'danger', 'dead'];
  return states.map(state => `/assets/characters/${characterType}/${state}.png`);
}

/**
 * デフォルトのキャラクタータイプ
 * 新規ペット作成時などに使用
 */
export const DEFAULT_CHARACTER_TYPE: CharacterType = 'cyber-fairy';
