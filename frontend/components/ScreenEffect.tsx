'use client';

/**
 * ScreenEffect - 画面全体に適用されるCRTエフェクト
 *
 * スキャンライン＋ビネットを常に画面全体（モバイル含む）にオーバーレイ表示。
 * position: fixed + inset: 0 で、スクロールやiOSステータスバーに影響されない。
 */
export default function ScreenEffect() {
  return (
    <>
      {/* Scanlines Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          width: '100vw',
          height: '100dvh',
          background: 'linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Vignette Effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          width: '100vw',
          height: '100dvh',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />
    </>
  );
}
