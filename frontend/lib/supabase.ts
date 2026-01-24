import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // 環境変数から改行や空白を除去（念のため）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, '') || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/\s+/g, '') || '';

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined;
          const cookies = document.cookie.split('; ');
          const cookie = cookies.find(c => c.startsWith(`${name}=`));
          return cookie?.split('=')[1];
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return;
          let cookie = `${name}=${value}`;
          if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
          if (options?.path) cookie += `; path=${options.path}`;
          document.cookie = cookie;
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') return;
          document.cookie = `${name}=; path=${options?.path || '/'}; max-age=0`;
        },
      },
    }
  )
}
