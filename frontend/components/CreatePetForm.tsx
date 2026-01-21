"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPet } from "../lib/api";
import StasisChamber from "./StasisChamber";

interface CreatePetFormProps {
  userId: string;
  onSuccess: () => void;
  /** デモ用: trueの場合はAPIを呼ばずに疑似成功する */
  mockMode?: boolean;
}

/**
 * CreatePetForm - 被験体初期化コンソール
 * 
 * 新規ユーザーがペットを作成するための没入感のあるフォーム。
 * StasisChamberと連携し、サイバーパンク・ホラーな雰囲気で演出。
 * Framer Motion による劇的な誕生シーケンスを実装。
 */
export default function CreatePetForm({ userId, onSuccess, mockMode = false }: CreatePetFormProps) {
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 入力フィールドにフォーカスしているかどうか
  const [isFocused, setIsFocused] = useState(false);

  // 初期化シーケンス中の演出フェーズ
  const [initPhase, setInitPhase] = useState<'idle' | 'initializing' | 'awakening' | 'complete'>('idle');

  // ターミナル風の起動メッセージ
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const bootIndexRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // 心拍数（誕生シーケンス用）
  const [heartbeatIntensity, setHeartbeatIntensity] = useState(0);

  // フラッシュエフェクト
  const [showFlash, setShowFlash] = useState(false);

  // 起動時のターミナルログアニメーション
  useEffect(() => {
    const messages = [
      "[ SYSTEM ] CHAMBER_INTERFACE_LOADED",
      "[ SYSTEM ] AWAITING_SUBJECT_DESIGNATION...",
      "[ SYSTEM ] ENTER_IDENTIFIER_TO_PROCEED",
    ];

    const interval = setInterval(() => {
      const currentIndex = bootIndexRef.current;
      if (currentIndex < messages.length) {
        const message = messages[currentIndex];
        if (message) {
          setBootMessages(prev => [...prev, message]);
        }
        bootIndexRef.current = currentIndex + 1;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // メッセージが追加されたら自動スクロール（ターミナル内のみ）
  useEffect(() => {
    // ターミナル内部のみスクロール、ページ全体はスクロールしない
    if (terminalRef.current && messagesEndRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [bootMessages]);

  // 心拍アニメーション（初期化中）
  useEffect(() => {
    if (initPhase === 'initializing') {
      // 徐々に心拍を強くする
      const interval = setInterval(() => {
        setHeartbeatIntensity(prev => Math.min(prev + 0.1, 1));
      }, 200);
      return () => clearInterval(interval);
    } else if (initPhase === 'awakening') {
      setHeartbeatIntensity(1);
    } else {
      setHeartbeatIntensity(0);
    }
  }, [initPhase]);

  // 培養槽の発光強度を決定
  const glowIntensity = useCallback((): 'low' | 'normal' | 'high' => {
    if (initPhase === 'initializing' || initPhase === 'awakening') {
      return 'high';
    }
    if (isFocused) {
      return 'high';
    }
    return 'normal';
  }, [isFocused, initPhase]);

  // 誕生シーケンスの実行
  const runBirthSequence = async () => {
    // Phase 1: 初期化開始
    setInitPhase('initializing');

    const initMessages = [
      "[ INIT ] SEQUENCE_STARTED...",
      "[ INIT ] VALIDATING_DESIGNATION...",
      `[ INIT ] SUBJECT_ID: ${petName.trim().toUpperCase()}`,
      "[ INIT ] ALLOCATING_CHAMBER_RESOURCES...",
      "[ INIT ] SYNCING_BIOMETRICS...",
      "[ INIT ] ESTABLISHING_NEURAL_LINK...",
    ];

    for (let i = 0; i < initMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setBootMessages(prev => [...prev, initMessages[i]]);
    }

    // Phase 2: 覚醒シーケンス
    setInitPhase('awakening');

    const awakeningMessages = [
      "[ VITAL ] HEARTBEAT_DETECTED...",
      "[ VITAL ] NEURAL_PATHWAYS_FORMING...",
      "[ VITAL ] CONSCIOUSNESS_EMERGING...",
    ];

    for (const msg of awakeningMessages) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setBootMessages(prev => [...prev, msg]);
    }

    // フラッシュエフェクト
    setShowFlash(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    setShowFlash(false);
    await new Promise(resolve => setTimeout(resolve, 100));
    setShowFlash(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    setShowFlash(false);
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!petName.trim()) {
      setError("DESIGNATION_REQUIRED");
      setBootMessages(prev => [...prev, "[ ERROR ] EMPTY_DESIGNATION_REJECTED"]);
      return;
    }

    if (petName.trim().length < 2) {
      setError("DESIGNATION_TOO_SHORT");
      setBootMessages(prev => [...prev, "[ ERROR ] MINIMUM_2_CHARACTERS_REQUIRED"]);
      return;
    }

    if (petName.trim().length > 50) {
      setError("DESIGNATION_TOO_LONG");
      setBootMessages(prev => [...prev, "[ ERROR ] MAXIMUM_50_CHARACTERS_EXCEEDED"]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 誕生シーケンスの演出を開始
      await runBirthSequence();

      if (mockMode) {
        // モックモード: APIを呼ばずに疑似待機
        await new Promise(resolve => setTimeout(resolve, 800));
        setBootMessages(prev => [...prev, "[ MOCK ] SIMULATING_API_RESPONSE..."]);
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // 本番: 実際のAPIを呼び出し
        await createPet({
          user_id: userId,
          name: petName.trim(),
        });
      }

      // 成功メッセージ
      setBootMessages(prev => [...prev, "[ SUCCESS ] SUBJECT_INITIALIZED"]);
      setBootMessages(prev => [...prev, "[ SUCCESS ] LIFE_SIGNS_STABLE"]);
      setBootMessages(prev => [...prev, "[ SUCCESS ] REDIRECTING_TO_DASHBOARD..."]);
      setInitPhase('complete');

      // 最終フラッシュ
      setShowFlash(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowFlash(false);

      // 少し待ってからコールバック
      await new Promise(resolve => setTimeout(resolve, 1200));
      onSuccess();
    } catch (err) {
      // エラーメッセージを適切に取得
      let errorMessage = "INITIALIZATION_FAILED";
      if (err instanceof Error) {
        errorMessage = err.message || "UNKNOWN_ERROR";
      }

      setError(errorMessage);
      setBootMessages(prev => [...prev, `[ FATAL ] ${errorMessage}`]);
      setBootMessages(prev => [...prev, "[ FATAL ] INITIALIZATION_SEQUENCE_ABORTED"]);
      setInitPhase('idle');
      console.error("CreatePet Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 心拍振動のバリエーション（Framer Motion型互換）
  const heartbeatVariants = {
    idle: { scale: 1, x: 0 },
    beating: {
      scale: [1, 1.02, 1, 1.01, 1],
      x: [0, -2, 2, -1, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    },
    intense: {
      scale: [1, 1.05, 0.98, 1.03, 1],
      x: [0, -4, 4, -2, 0],
      filter: [
        "brightness(1) hue-rotate(0deg)",
        "brightness(1.2) hue-rotate(10deg)",
        "brightness(0.9) hue-rotate(-10deg)",
        "brightness(1.1) hue-rotate(5deg)",
        "brightness(1) hue-rotate(0deg)",
      ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    }
  };

  // 培養槽のアニメーションステート
  const getChamberAnimation = () => {
    if (initPhase === 'awakening') return 'intense';
    if (initPhase === 'initializing') return 'beating';
    return 'idle';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 relative">
      {/* ========== フラッシュオーバーレイ ========== */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 bg-cyan-200 z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ========== ノイズオーバーレイ（初期化中） ========== */}
      <AnimatePresence>
        {(initPhase === 'initializing' || initPhase === 'awakening') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 + heartbeatIntensity * 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] mix-blend-screen pointer-events-none z-[60]"
          />
        )}
      </AnimatePresence>

      {/* メインコンテナ - モバイル対応でキーボード表示時にも崩れないように */}
      <motion.div
        className="flex flex-col items-center gap-6 md:gap-8"
        animate={initPhase === 'awakening' ? {
          x: [0, -3, 3, -2, 2, 0],
          transition: { duration: 0.3, repeat: Infinity }
        } : {}}
      >

        {/* ========== 培養槽プレビュー ========== */}
        <motion.div
          className="w-80 sm:w-96 md:w-[28rem]"
          variants={heartbeatVariants}
          animate={getChamberAnimation()}
        >
          <StasisChamber
            hp={100}
            imageSrc="/assets/unnamed.png"
            status="UNINITIALIZED"
            glowIntensity={glowIntensity()}
          />
        </motion.div>

        {/* ========== ターミナルログ表示エリア ========== */}
        <motion.div
          ref={terminalRef}
          className="w-full max-h-24 md:max-h-32 overflow-y-auto bg-black/80 border border-cyan-900/50 rounded p-2 font-mono text-[10px] md:text-xs"
          animate={initPhase === 'awakening' ? {
            borderColor: ["rgba(6, 182, 212, 0.5)", "rgba(34, 211, 238, 0.8)", "rgba(6, 182, 212, 0.5)"],
            boxShadow: [
              "0 0 10px rgba(6, 182, 212, 0.3)",
              "0 0 30px rgba(34, 211, 238, 0.6)",
              "0 0 10px rgba(6, 182, 212, 0.3)",
            ],
            transition: { duration: 0.5, repeat: Infinity }
          } : {}}
        >
          {bootMessages
            .filter((msg): msg is string => typeof msg === 'string' && msg.length > 0)
            .map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`
                  ${msg.includes('ERROR') || msg.includes('FATAL') ? 'text-red-500' : ''}
                  ${msg.includes('SUCCESS') ? 'text-emerald-400' : ''}
                  ${msg.includes('INIT') ? 'text-cyan-400' : ''}
                  ${msg.includes('SYSTEM') ? 'text-green-500' : ''}
                  ${msg.includes('VITAL') ? 'text-pink-400' : ''}
                  leading-relaxed
                `}
              >
                {msg}
              </motion.div>
            ))}
          <div ref={messagesEndRef} />
          {/* ブリンキングカーソル */}
          <motion.span
            className="inline-block w-2 h-3 bg-green-500"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* ========== 入力フォーム ========== */}
        <motion.div
          className="w-full"
          animate={initPhase === 'complete' ? {
            scale: [1, 1.02, 1],
            transition: { duration: 0.5 }
          } : {}}
        >
          <div className="relative border-2 border-cyan-900/60 bg-black/90 p-4 md:p-6 shadow-[0_0_30px_rgba(0,255,255,0.1)] backdrop-blur-sm">
            {/* グリッチオーバーレイ */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] mix-blend-screen" />

            {/* ヘッダー */}
            <div className="relative z-10 mb-4 md:mb-6 text-center">
              <motion.h2
                className="text-xl md:text-2xl font-black text-cyan-400 tracking-[0.15em] md:tracking-[0.2em] uppercase mb-1 glitch-text"
                data-text="INITIALIZE"
                animate={initPhase === 'awakening' ? {
                  textShadow: [
                    "0 0 10px rgba(34, 211, 238, 0.5)",
                    "0 0 30px rgba(34, 211, 238, 1)",
                    "0 0 10px rgba(34, 211, 238, 0.5)",
                  ],
                  transition: { duration: 0.3, repeat: Infinity }
                } : {}}
              >
                INITIALIZE
              </motion.h2>
              <div className="text-[10px] md:text-xs text-cyan-700 tracking-[0.2em] uppercase">
                SUBJECT_REGISTRATION_PROTOCOL
              </div>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4 md:space-y-5">
              {/* 入力フィールド */}
              <div>
                <label
                  htmlFor="petName"
                  className="block text-[10px] md:text-xs text-cyan-500 tracking-[0.15em] md:tracking-[0.2em] uppercase mb-2 font-mono"
                >
                  SUBJECT_IDENTIFIER:
                </label>
                <input
                  id="petName"
                  type="text"
                  value={petName}
                  onChange={(e) => {
                    setPetName(e.target.value);
                    setError(null);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={loading}
                  placeholder="ENTER_DESIGNATION..."
                  maxLength={50}
                  autoComplete="off"
                  className={`
                    w-full px-3 md:px-4 py-2 md:py-3 
                    bg-black border-2 
                    ${isFocused ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'border-cyan-900'}
                    text-cyan-300 font-mono text-sm tracking-wider 
                    placeholder:text-cyan-900/50 
                    focus:outline-none 
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                />
                <div className="mt-1 flex justify-between text-[10px] text-cyan-800 tracking-widest">
                  <span>{petName.length}/50 CHARS</span>
                  {petName.length >= 2 && (
                    <span className="text-cyan-500">✓ VALID</span>
                  )}
                </div>
              </div>

              {/* エラーメッセージ */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-red-900 bg-red-950/30 p-2 md:p-3"
                  >
                    <p className="text-red-500 text-xs tracking-wider text-center font-mono uppercase">
                      ⚠ {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 送信ボタン */}
              <motion.button
                type="submit"
                disabled={loading || !petName.trim() || petName.trim().length < 2}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={`
                  w-full p-3 md:p-4 
                  border-2 border-cyan-800 
                  bg-black hover:bg-cyan-900/20 active:bg-cyan-900/40 
                  text-cyan-400 hover:text-cyan-300 
                  transition-all duration-300
                  text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase font-bold 
                  disabled:opacity-40 disabled:cursor-not-allowed 
                  group relative overflow-hidden
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>
                        {initPhase === 'awakening' ? 'AWAKENING...' : 'INITIALIZING...'}
                      </span>
                    </>
                  ) : (
                    "[ INITIALIZE_SUBJECT ]"
                  )}
                </span>
                {/* ホバー時のスキャンライン */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </form>

            {/* 警告メッセージ */}
            <div className="relative z-10 mt-4 md:mt-6 border-t border-cyan-900/30 pt-3 md:pt-4">
              <div className="text-[9px] md:text-[10px] text-cyan-900/70 tracking-widest text-center space-y-1">
                <div className="text-red-700">⚠ CAUTION: LIFE_SUPPORT_PROTOCOL_ACTIVE</div>
                <div>SUBJECT_REQUIRES_DAILY_MAINTENANCE</div>
                <div className="text-red-800">NEGLECT → SUBJECT_TERMINATION</div>
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="text-center mt-3 text-[10px] text-cyan-900/50 tracking-[0.2em]">
            CHAMBER_INITIALIZATION_v1.0.3
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
