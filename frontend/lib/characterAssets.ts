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
export type CharacterType = 'cyber-fairy' | 'bio-mutant' | 'void-geometry'; // synth-android removed temporarily

/**
 * HP閾値の設定
 * 各状態の境界値を一元管理（調整が必要な場合はここを変更）
 */
export const HP_THRESHOLDS = {
  HEALTHY_MIN: 80,
  CAUTION_MIN: 50,
  DANGER_MIN: 20,
} as const;

/**
 * HPからキャラクター状態を判定する
 */
export function getCharacterHealthState(hp: number): CharacterHealthState {
  if (hp >= HP_THRESHOLDS.HEALTHY_MIN) return 'healthy';
  if (hp >= HP_THRESHOLDS.CAUTION_MIN) return 'caution';
  if (hp >= HP_THRESHOLDS.DANGER_MIN) return 'danger';
  return 'dead';
}

/**
 * キャラクター画像のパスを生成する (ディレクトリ構成準拠)
 */
export function getCharacterImagePath(
  characterType: CharacterType,
  status: CharacterHealthState
): string {
  // Standard folder structure: /assets/characters/[type]/[status].png
  return `/assets/characters/${characterType}/${status}.png`;
}

/**
 * HPから画像パスを取得する（旧API互換用ヘルパー）
 */
export function getCharacterImagePathFromHp(
  characterType: CharacterType,
  hp: number
): string {
  const state = getCharacterHealthState(hp);
  return getCharacterImagePath(characterType, state);
}

/**
 * ステータス文字列から画像パスを取得
 */
export function getCharacterImageByStatus(
  characterType: CharacterType,
  hp: number,
  status: 'ALIVE' | 'DEAD' | 'CRITICAL' | 'UNINITIALIZED'
): string {
  // DEADステータスは直接dead画像を返す
  if (status === 'DEAD') {
    return getCharacterImagePath(characterType, 'dead');
  }

  // UNINITIALIZEDはhealthy（デフォルト/プレビュー表示）を返す
  if (status === 'UNINITIALIZED') {
    return getCharacterImagePath(characterType, 'healthy');
  }

  // ALIVE/CRITICALはHPに基づいて判定
  return getCharacterImagePathFromHp(characterType, hp);
}

/**
 * すべてのキャラクター画像を事前読み込み用にリストアップ
 */
export function getAllCharacterImages(characterType: CharacterType): string[] {
  const states: CharacterHealthState[] = ['healthy', 'caution', 'danger', 'dead'];
  return states.map(state => getCharacterImagePath(characterType, state));
}

/**
 * デフォルトのキャラクタータイプ
 * 新規ペット作成時などに使用
 */
export const DEFAULT_CHARACTER_TYPE: CharacterType = 'cyber-fairy';
