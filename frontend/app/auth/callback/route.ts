import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  // Originの決定（環境変数を優先、なければリクエストURLから）
  // Vercel等のプロキシ環境下で http と誤認されるのを防ぐ
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  console.log('[Auth Callback] Request received:', {
    url: request.url,
    code: code ? `${code.substring(0, 10)}...` : null,
    next,
    siteUrl,
    origin: requestUrl.origin,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (code) {
    const cookieStore = await cookies()

    // 環境変数から改行や空白を除去（念のため）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, '') || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/\s+/g, '') || '';

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              console.error('Error setting cookie in callback:', error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              console.error('Error removing cookie in callback:', error)
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 成功したら next へリダイレクト
      // siteUrl が末尾スラッシュを持つか確認して結合
      const baseUrl = siteUrl.replace(/\/$/, '');
      const redirectPath = next.startsWith('/') ? next : `/${next}`;
      console.log('[Auth Callback] Success! Redirecting to:', `${baseUrl}${redirectPath}`);
      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }

    console.error('[Auth Callback] Code exchange error:', {
      error,
      errorMessage: error.message,
      errorName: error.name,
      errorStatus: (error as any).status,
    });
    // エラー詳細をクエリパラメータに含める
    return NextResponse.redirect(`${siteUrl}/login?error=auth_code_error&details=${encodeURIComponent(error.message)}`)
  }

  console.error('No code provided in auth callback')
  return NextResponse.redirect(`${siteUrl}/login?error=no_code_provided`)
}
