import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WSL環境: package.jsonでCHOKIDAR_USEPOLLING=trueを設定済み

  // 本番公開前の一時的なリダイレクト設定
  // ルートアクセスをデモページに飛ばし、本番機能への直接アクセスを防ぐ
  async redirects() {
    return [
      {
        source: '/',           // ルートにアクセスした人を
        destination: '/demo',  // デモページに飛ばす
        permanent: false,      // 307 Temporary Redirect（一時的）
      },
      // 認証ページへの直リンクも防ぐ
      {
        source: '/login',
        destination: '/demo',
        permanent: false,
      },
      // 本番を開放する際はこの redirects() をコメントアウトまたは削除
    ];
  },
};

export default nextConfig;
