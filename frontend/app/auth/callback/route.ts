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

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }

    console.error('OAuth callback code exchange error:', error)
    // エラー詳細をクエリパラメータに含める
    return NextResponse.redirect(`${siteUrl}/login?error=auth_code_error&details=${encodeURIComponent(error.message)}`)
  }

  console.error('No code provided in auth callback')
  return NextResponse.redirect(`${siteUrl}/login?error=no_code_provided`)
}
