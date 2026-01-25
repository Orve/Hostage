/**
 * HOSTAGE SYSTEM - Multi-Language Dictionary
 * Sci-Fi Horror Translation Module
 */

export type Locale = 'en' | 'ja';

export const dict = {
  // ========================================
  // STATUS INDICATORS
  // ========================================
  status: {
    ALIVE: {
      en: 'VITAL STABLE',
      ja: 'バイタル安定',
    },
    DEAD: {
      en: 'SIGNAL LOST',
      ja: '反応消失',
    },
    INCUBATING: {
      en: 'INCUBATING...',
      ja: '培養シーケンス実行中...',
    },
    CRITICAL: {
      en: 'CRITICAL_ERROR',
      ja: '致命的エラー',
    },
    UNSTABLE: {
      en: 'UNSTABLE',
      ja: '不安定',
    },
    OPERATIONAL: {
      en: 'OPERATIONAL',
      ja: '正常稼働',
    },
    SYSTEM_FAILURE: {
      en: 'SYSTEM_FAILURE',
      ja: 'システム停止',
    },
    CONNECTION_TERMINATED: {
      en: 'CONNECTION_TERMINATED_BY_HOST',
      ja: 'ホストにより接続終了',
    },
  },

  // ========================================
  // CREATURE TYPES
  // ========================================
  type: {
    'cyber-fairy': {
      en: 'TYPE: CYBER-FAIRY',
      ja: '個体名：電脳妖精',
    },
    'bio-mutant': {
      en: 'TYPE: BIO-MUTANT',
      ja: '個体名：深淵軟体種',
    },
  },

  // ========================================
  // UI ELEMENTS
  // ========================================
  ui: {
    hp: {
      en: 'PSYCHO-STRUCTURAL INTEGRITY',
      ja: '精神構造体強度',
    },
    feed: {
      en: 'INJECT NUTRIENTS',
      ja: '養分供給',
    },
    revive: {
      en: 'RECONSTRUCT SEQUENCE',
      ja: '再構成シーケンス',
    },
    dashboard: {
      en: 'CONTROL MATRIX',
      ja: '制御マトリクス',
    },
    stasis: {
      en: 'STASIS CHAMBER',
      ja: '冷凍保管庫',
    },
    tasks: {
      en: 'MISSION LOG',
      ja: 'ミッション記録',
    },
    habits: {
      en: 'PROTOCOL ROUTINES',
      ja: 'プロトコル実行',
    },
    subject: {
      en: 'SUBJECT',
      ja: '被験体',
    },
    infection_level: {
      en: 'INFECTION_LEVEL',
      ja: '汚染レベル',
    },
    no_active_pet: {
      en: 'No Active Pet',
      ja: 'アクティブな被験体なし',
    },
    build: {
      en: 'BUILD',
      ja: 'ビルド',
    },
    mode: {
      en: 'MODE',
      ja: 'モード',
    },
    system_status_operational: {
      en: 'SYSTEM STATUS: OPERATIONAL',
      ja: 'システム状態：正常稼働中',
    },
    chamber_interface: {
      en: 'CHAMBER_INTERFACE',
      ja: '培養槽インターフェース',
    },
  },

  // ========================================
  // ERROR MESSAGES
  // ========================================
  error: {
    data_corruption: {
      en: 'DATA CORRUPTION',
      ja: '致命的なデータ破損',
    },
    connection_lost: {
      en: 'CONNECTION LOST',
      ja: 'サーバー応答なし',
    },
    authentication_failed: {
      en: 'AUTHENTICATION FAILED',
      ja: '認証プロトコル失敗',
    },
    unknown_error: {
      en: 'SYSTEM MALFUNCTION',
      ja: 'システム異常検出',
    },
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================
  action: {
    confirm: {
      en: 'CONFIRM',
      ja: '承認',
    },
    cancel: {
      en: 'ABORT',
      ja: '中断',
    },
    delete: {
      en: 'TERMINATE',
      ja: '終了',
    },
    save: {
      en: 'SAVE TO MEMORY',
      ja: 'メモリに保存',
    },
    create_task: {
      en: 'CREATE NEW TASK',
      ja: '新規タスク作成',
    },
    complete_task: {
      en: 'COMPLETE',
      ja: '完了',
    },
    add: {
      en: 'ADD',
      ja: '追加',
    },
  },

  // ========================================
  // TASK MANAGER
  // ========================================
  task: {
    active_tasks: {
      en: 'ACTIVE_TASKS',
      ja: '実行中タスク',
    },
    no_tasks: {
      en: 'NO_ACTIVE_TASKS',
      ja: '実行中タスクなし',
    },
    add_task_help: {
      en: 'ADD A TASK TO HEAL YOUR SUBJECT',
      ja: 'タスクを追加して被験体を回復',
    },
    loading: {
      en: 'LOADING_TASKS...',
      ja: 'タスク読込中...',
    },
    creating: {
      en: 'CREATING...',
      ja: '作成中...',
    },
    title_placeholder: {
      en: 'ENTER_TASK_DESIGNATION...',
      ja: 'タスク名を入力...',
    },
    add_task: {
      en: '+ ADD_TASK',
      ja: '+ タスク追加',
    },
    create_task: {
      en: 'CREATE_TASK',
      ja: 'タスク作成',
    },
    priority: {
      en: 'PRIORITY:',
      ja: '優先度：',
    },
    priority_critical: {
      en: 'CRITICAL',
      ja: '緊急',
    },
    priority_high: {
      en: 'HIGH',
      ja: '高',
    },
    priority_medium: {
      en: 'MEDIUM',
      ja: '中',
    },
    priority_low: {
      en: 'LOW',
      ja: '低',
    },
    overdue: {
      en: 'OVERDUE',
      ja: '期限超過',
    },
    days_overdue_suffix: {
      en: 'D OVERDUE',
      ja: '日超過',
    },
    due: {
      en: 'DUE:',
      ja: '期限：',
    },
    damage_active: {
      en: '[DAMAGE_ACTIVE]',
      ja: '[ダメージ進行中]',
    },
  },

  // ========================================
  // LOGIN PAGE
  // ========================================
  login: {
    title: {
      en: 'HOSTAGE',
      ja: 'HOSTAGE',
    },
    subtitle: {
      en: 'Negligence Protocol v0.9.9',
      ja: '怠惰監視プロトコル v0.9.9',
    },
    auth_required: {
      en: '[ Authentication Required ]',
      ja: '[ 認証が必要です ]',
    },
    auth_description: {
      en: 'Your tasks demand supervision.\nIdentify yourself to proceed.',
      ja: 'タスク監視システムへのアクセスには認証が必要です。\n身元を確認してください。',
    },
    sign_in_google: {
      en: '[ Sign In With Google ]',
      ja: '[ Google認証でログイン ]',
    },
    connecting: {
      en: '[ Connecting... ]',
      ja: '[ 接続中... ]',
    },
    warning: {
      en: '⚠ Warning: Your negligence has consequences',
      ja: '⚠ 警告：怠惰には代償が伴います',
    },
    status_awaiting: {
      en: 'System Status: Awaiting Authorization',
      ja: 'システム状態：認証待機中',
    },
    loading: {
      en: 'LOADING',
      ja: '読込中',
    },
  },

  // ========================================
  // DASHBOARD PAGE
  // ========================================
  dashboard: {
    loading_system: {
      en: 'LOADING_SYSTEM',
      ja: 'システム起動中',
    },
    please_wait: {
      en: '[ PLEASE_WAIT ]',
      ja: '[ お待ちください ]',
    },
    sync_notion: {
      en: 'SYNC_NOTION',
      ja: 'Notionと同期する',
    },
    syncing: {
      en: 'SYNCING...',
      ja: '同期中...',
    },
  },

  // ========================================
  // INCUBATION / CREATE PET
  // ========================================
  incubation: {
    initialize: {
      en: 'INITIALIZE',
      ja: '初期化',
    },
    subject_registration: {
      en: 'SUBJECT_REGISTRATION_PROTOCOL',
      ja: '被験体登録プロトコル',
    },
    select_genotype: {
      en: 'SELECT_GENOTYPE:',
      ja: '遺伝子型選択：',
    },
    subject_identifier: {
      en: 'SUBJECT_IDENTIFIER:',
      ja: '被験体識別子：',
    },
    enter_designation: {
      en: 'ENTER_DESIGNATION...',
      ja: '識別名を入力...',
    },
    chars_valid: {
      en: 'CHARS',
      ja: '文字',
    },
    valid: {
      en: '✓ VALID',
      ja: '✓ 有効',
    },
    initialize_subject: {
      en: '[ INITIALIZE_SUBJECT ]',
      ja: '[ 被験体を初期化 ]',
    },
    initializing: {
      en: 'INITIALIZING...',
      ja: '初期化中...',
    },
    filling: {
      en: 'FILLING...',
      ja: '充填中...',
    },
    materializing: {
      en: 'MATERIALIZING...',
      ja: '実体化中...',
    },
    awakening: {
      en: 'AWAKENING...',
      ja: '覚醒中...',
    },
    locked: {
      en: 'LOCKED',
      ja: 'ロック',
    },
    spec: {
      en: 'SPEC:',
      ja: 'スペック：',
    },
    stability: {
      en: 'STABILITY',
      ja: '安定性',
    },
    resilience: {
      en: 'RESILIENCE',
      ja: '耐久性',
    },
    sync_rate: {
      en: 'SYNC_RATE',
      ja: '同期率',
    },
    caution_life_support: {
      en: '⚠ CAUTION: LIFE_SUPPORT_PROTOCOL_ACTIVE',
      ja: '⚠ 注意：生命維持プロトコル稼働中',
    },
    requires_maintenance: {
      en: 'SUBJECT_REQUIRES_DAILY_MAINTENANCE',
      ja: '被験体には日次メンテナンスが必要です',
    },
    neglect_warning: {
      en: 'NEGLECT → SUBJECT_TERMINATION',
      ja: '怠惰 → 被験体終了',
    },
    chamber_version: {
      en: 'CHAMBER_INITIALIZATION_v1.0.3',
      ja: '培養槽初期化システム v1.0.3',
    },
    // Character types
    type_fairy: {
      en: 'TYPE-A: FAIRY',
      ja: 'TYPE-A: 妖精型',
    },
    type_polyp: {
      en: 'TYPE-B: POLYP',
      ja: 'TYPE-B: ポリプ型',
    },
    desc_fairy: {
      en: 'Digital construct. Sensitive to neglect.',
      ja: 'デジタル構造体。怠惰に敏感。',
    },
    desc_polyp: {
      en: 'Deep sea organism. High corruption risk.',
      ja: '深海生物。汚染リスク高。',
    },
    // Error messages
    error_designation_required: {
      en: 'DESIGNATION_REQUIRED',
      ja: '識別名が必要です',
    },
    error_designation_short: {
      en: 'DESIGNATION_TOO_SHORT',
      ja: '識別名が短すぎます',
    },
    error_designation_long: {
      en: 'DESIGNATION_TOO_LONG',
      ja: '識別名が長すぎます',
    },
  },

  // ========================================
  // HABIT MANAGER
  // ========================================
  habit: {
    daily_habits: {
      en: 'DAILY_HABITS',
      ja: 'デイリールーチン',
    },
    total: {
      en: 'TOTAL',
      ja: '合計',
    },
    add_habit: {
      en: '+ ADD_HABIT',
      ja: '+ ルーチン追加',
    },
    create_habit: {
      en: 'CREATE_HABIT',
      ja: 'ルーチン作成',
    },
    creating: {
      en: 'CREATING...',
      ja: '作成中...',
    },
    no_habits: {
      en: 'NO_DAILY_HABITS',
      ja: 'デイリールーチンなし',
    },
    add_habit_help: {
      en: 'CREATE A ROUTINE TO SUSTAIN VITALS',
      ja: 'ルーチンを作成してバイタルを維持',
    },
    loading: {
      en: 'LOADING_HABITS...',
      ja: 'ルーチン読込中...',
    },
    completed_today: {
      en: 'COMPLETED',
      ja: '完了済',
    },
    title_placeholder: {
      en: 'ENTER_HABIT_NAME...',
      ja: 'ルーチン名を入力...',
    },
    streak_days: {
      en: 'days streak',
      ja: '日連続',
    },
    streak_message: {
      en: 'days in a row!',
      ja: '日連続！',
    },
    completed: {
      en: 'Completed!',
      ja: '完了！',
    },
  },
} as const;

/**
 * Type-safe translation function
 */
export function t(
  key: string,
  locale: Locale = 'en'
): string {
  const keys = key.split('.');
  let value: any = dict;

  for (const k of keys) {
    value = value?.[k];
    if (!value) {
      console.warn(`[i18n] Translation key not found: ${key}`);
      return key;
    }
  }

  return value[locale] || value.en || key;
}
