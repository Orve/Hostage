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
    desc_void_geometry: {
      en: 'High stability. Slow recovery.',
      ja: '高安定型。堅牢だが再構築に時間を要する。',
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
  // PWA INSTALL PROMPT
  // ========================================
  pwa: {
    system_alert: {
      en: '⚠ SYSTEM_ALERT',
      ja: '⚠ システム警告',
    },
    restricted_mode: {
      en: '⚡ RESTRICTED_MODE_DETECTED',
      ja: '⚡ 制限モード検出',
    },
    browser_shell: {
      en: 'Running in browser shell. Install to',
      ja: 'ブラウザシェルで実行中。',
    },
    local_shell: {
      en: 'LOCAL_SHELL',
      ja: 'ローカルシェル',
    },
    full_experience: {
      en: 'for full immersive experience.',
      ja: 'にインストールして完全な没入体験を。',
    },
    installation_protocol: {
      en: '&gt;&gt; INSTALLATION_PROTOCOL:',
      ja: '&gt;&gt; インストール手順：',
    },
    // iOS instructions
    ios_step1: {
      en: 'Tap the',
      ja: '画面下部の',
    },
    ios_share: {
      en: 'Share',
      ja: '共有',
    },
    ios_step1_end: {
      en: 'button at the bottom',
      ja: 'ボタンをタップ',
    },
    ios_step2: {
      en: 'Select',
      ja: 'メニューから',
    },
    ios_add_home: {
      en: '"Add to Home Screen"',
      ja: '「ホーム画面に追加」',
    },
    ios_step2_end: {
      en: '',
      ja: 'を選択',
    },
    ios_step3: {
      en: 'Confirm installation',
      ja: 'インストールを確認',
    },
    // Android instructions
    android_step1: {
      en: 'Tap the',
      ja: '右上の',
    },
    android_menu: {
      en: 'Menu',
      ja: 'メニュー',
    },
    android_step1_end: {
      en: 'button (⋮) at the top-right',
      ja: 'ボタン（⋮）をタップ',
    },
    android_step2: {
      en: 'Select',
      ja: 'メニューから',
    },
    android_add_home: {
      en: '"Add to Home screen"',
      ja: '「ホーム画面に追加」',
    },
    android_or: {
      en: 'or',
      ja: 'または',
    },
    android_install: {
      en: '"Install App"',
      ja: '「アプリをインストール」',
    },
    android_step3: {
      en: 'Confirm installation',
      ja: 'インストールを確認',
    },
    // Benefits
    benefit_fullscreen: {
      en: '✓ Fullscreen immersion (no browser UI)',
      ja: '✓ フルスクリーン没入体験（ブラウザUIなし）',
    },
    benefit_loading: {
      en: '✓ Faster loading & offline access',
      ja: '✓ 高速起動 & オフラインアクセス',
    },
    benefit_native: {
      en: '✓ Native app-like experience',
      ja: '✓ ネイティブアプリのような体験',
    },
    dismiss: {
      en: '[ DISMISS_NOTIFICATION ]',
      ja: '[ 通知を閉じる ]',
    },
  },

  // ========================================
  // SYSTEM GUIDE MODAL
  // ========================================
  guide: {
    title: {
      en: 'SYSTEM_OPERATION_MANUAL',
      ja: 'システム操作マニュアル',
    },
    version: {
      en: 'VERSION 1.0 - MANDATORY_READING',
      ja: 'バージョン 1.0 - 必読',
    },
    // Warning banner
    critical_warning: {
      en: '⚡ CRITICAL_WARNING',
      ja: '⚡ 重大な警告',
    },
    warning_text: {
      en: 'NEGLIGENCE LEADS TO TERMINATION. The subject under your care will die if maintenance protocols are not followed. Data loss is permanent and irreversible.',
      ja: '怠惰は終了を招きます。管理下の被験体は、メンテナンスプロトコルに従わなければ死亡します。データ消失は永久的かつ不可逆的です。',
    },
    // Primary objective
    primary_objective: {
      en: 'PRIMARY_OBJECTIVE',
      ja: '主要目標',
    },
    objective_text: {
      en: 'Maintain life support for your designated subject (character/pet). The entity\'s HP must remain above 0. If HP reaches 0,',
      ja: '指定された被験体（キャラクター/ペット）の生命維持を行うこと。HPは0以上に保つ必要があります。HPが0になると、',
    },
    termination_final: {
      en: 'TERMINATION IS FINAL',
      ja: '終了は最終的',
    },
    progress_lost: {
      en: '. All progress will be lost.',
      ja: 'です。全ての進捗が失われます。',
    },
    // Step 1
    step1_title: {
      en: 'REGISTER_TASKS',
      ja: 'タスク登録',
    },
    step1_text: {
      en: 'Input your daily duties and responsibilities. Each task must have:',
      ja: '日々の業務と責任を入力してください。各タスクには以下が必要です：',
    },
    step1_title_field: {
      en: 'Title:',
      ja: 'タイトル：',
    },
    step1_title_desc: {
      en: 'Brief description',
      ja: '簡潔な説明',
    },
    step1_due_field: {
      en: 'Due Date:',
      ja: '期限：',
    },
    step1_due_desc: {
      en: 'Deadline for completion',
      ja: '完了期限',
    },
    step1_priority_field: {
      en: 'Priority:',
      ja: '優先度：',
    },
    step1_priority_desc: {
      en: 'Importance level',
      ja: '重要度レベル',
    },
    // Step 2
    step2_title: {
      en: 'COMPLETE_TASKS',
      ja: 'タスク完了',
    },
    step2_text: {
      en: 'Check off tasks when completed. Completed tasks within their deadline contribute to',
      ja: '完了したタスクにチェックを入れてください。期限内に完了したタスクは',
    },
    positive_support: {
      en: 'positive life support',
      ja: 'ポジティブな生命維持',
    },
    step2_text_end: {
      en: '.',
      ja: 'に貢献します。',
    },
    // Step 3
    step3_title: {
      en: 'PENALTY_PROTOCOL',
      ja: 'ペナルティプロトコル',
    },
    step3_text: {
      en: 'When overdue tasks remain incomplete during system SYNC, the subject will suffer damage.',
      ja: 'システムSYNC時に期限超過タスクが未完了の場合、被験体はダメージを受けます。',
    },
    step3_critical: {
      en: '⚡ CRITICAL:',
      ja: '⚡ 重要：',
    },
    damage_formula: {
      en: 'DAMAGE FORMULA:',
      ja: 'ダメージ計算式：',
    },
    damage_text: {
      en: 'Each overdue task inflicts HP loss. The longer you delay, the more severe the consequences.',
      ja: '期限超過タスク毎にHP損失が発生。遅延が長いほど、結果は深刻になります。',
    },
    // Step 4
    step4_title: {
      en: 'SYNC_STATUS',
      ja: 'ステータス同期',
    },
    step4_text: {
      en: 'The system performs automatic health checks. Open the dashboard regularly to confirm life signs.',
      ja: 'システムは自動的にヘルスチェックを実行します。定期的にダッシュボードを開いて生命兆候を確認してください。',
    },
    active_monitoring: {
      en: 'Active monitoring prevents catastrophic failure.',
      ja: 'アクティブな監視が壊滅的な失敗を防ぎます。',
    },
    // Step 5
    step5_title: {
      en: 'STAY_ALIVE',
      ja: '生存維持',
    },
    step5_text: {
      en: 'Keep HP above 0 at all costs. Monitor the status chamber frequently.',
      ja: '何があってもHPを0以上に保ってください。ステータスチャンバーを頻繁に監視してください。',
    },
    diligence: {
      en: 'Your diligence = Subject survival.',
      ja: 'あなたの勤勉さ = 被験体の生存。',
    },
    good_luck: {
      en: 'Good luck, Operator.',
      ja: '幸運を、オペレーター。',
    },
    // Additional notes
    additional_notes: {
      en: '&gt;&gt; ADDITIONAL_NOTES:',
      ja: '&gt;&gt; 追加情報：',
    },
    note_revive: {
      en: '• You can revive the subject if it dies, but this costs SOL (Solana tokens).',
      ja: '• 被験体が死亡した場合、SOL（Solanaトークン）を消費して復活可能です。',
    },
    note_habits: {
      en: '• Daily habits can be configured for recurring maintenance tasks.',
      ja: '• 定期的なメンテナンスタスクにデイリールーチンを設定できます。',
    },
    note_decay: {
      en: '• Visual decay effects indicate health deterioration (scanlines, noise, color shifts).',
      ja: '• ビジュアルデケイエフェクトが健康悪化を示します（走査線、ノイズ、色変化）。',
    },
    note_help: {
      en: '• This guide can be reopened anytime via the [?] HELP button.',
      ja: '• このガイドは [?] ヘルプボタンからいつでも再表示できます。',
    },
    // Footer
    acknowledge: {
      en: '[ ACKNOWLEDGED - I_UNDERSTAND ]',
      ja: '[ 了解 - 理解しました ]',
    },
    confirmation_text: {
      en: 'PRESSING THIS BUTTON CONFIRMS YOU HAVE READ AND UNDERSTOOD THE PROTOCOLS',
      ja: 'このボタンを押すことで、プロトコルを読み、理解したことを確認します',
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
  // ========================================
  // DEATH TIMER
  // ========================================
  timer: {
    estimated_termination: {
      en: 'ESTIMATED TERMINATION',
      ja: '推定終了時刻',
    },
    terminated: {
      en: 'TERMINATED',
      ja: '停止',
    },
    calculating: {
      en: 'CALCULATING...',
      ja: '算出中...',
    },
  },

  // ========================================
  // QUICK TASKS
  // ========================================
  quick: {
    focus_label: {
      en: '30m Focus',
      ja: '30分集中',
    },
    focus_title: {
      en: 'Deep Work Session',
      ja: 'ディープワーク・セッション',
    },
    reply_label: {
      en: 'Quick Reply',
      ja: '即レス処理',
    },
    reply_title: {
      en: 'Clear Inbox / Reply',
      ja: '受信トレイ整理 / 返信',
    },
    reset_label: {
      en: 'Reset Room',
      ja: '環境リセット',
    },
    reset_title: {
      en: 'Environment Reset (Clean)',
      ja: '作業環境リセット（清掃）',
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
