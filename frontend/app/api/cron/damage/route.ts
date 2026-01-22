import { NextResponse } from 'next/server';

/**
 * Vercel Cron用プロキシエンドポイント
 * 
 * Vercel CronはVercel内のパスにしかリクエストを送れないため、
 * このエンドポイントを経由して外部のバックエンドAPIを呼び出す。
 * 
 * Schedule: 毎日 JST 0:00 (UTC 15:00)
 */
export async function GET(request: Request) {
  // Vercel Cronからの呼び出しか確認（オプション）
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Bearer形式でCRON_SECRETが送られてくる場合の検証
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // 本番では厳格にチェック、開発時はスキップ可能
    console.warn('[CRON] Authorization header mismatch or missing');
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const apiKey = process.env.CRON_SECRET || 'hostage_cron_secret_2026';

  try {
    console.log('[CRON] Triggering daily damage calculation...');

    // バックエンドのダメージAPIを呼び出し
    const response = await fetch(`${backendUrl}/tasks/cron/damage`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CRON] Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Backend request failed', status: response.status, detail: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log('[CRON] Daily damage applied:', data);

    return NextResponse.json({
      success: true,
      message: 'Daily damage calculation completed',
      timestamp: new Date().toISOString(),
      result: data,
    });
  } catch (error) {
    console.error('[CRON] Failed to trigger damage:', error);
    return NextResponse.json(
      {
        error: 'Failed to trigger daily damage',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
