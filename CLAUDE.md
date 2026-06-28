@AGENTS.md

# MARILOG プロジェクト

## 概要

「結婚のリアルを話せる場所」をコンセプトにした体験・悩みシェアアプリ。  
既婚ユーザーが経験をデータとして登録し、結婚前ユーザーが参考にできるプラットフォーム。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **バックエンド**: Supabase（Auth / PostgreSQL / RLS）
- **スタイリング**: Tailwind v4（`@import "tailwindcss"`）、CSS カスタムプロパティでデザイントークン管理
- **認証**: Supabase Auth（メール/パスワード + Google OAuth）、`@supabase/ssr` で SSR セッション管理

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # ビルド
npm run lint   # ESLint
```

## ユーザー種別

| 種別 | 説明 |
|------|------|
| `married`（既婚） | 先輩DBに登録され、結婚前ユーザーの参考になる |
| `before`（結婚前） | 先輩データを参考にして悩みを相談できる |

## ページ構成

| パス | 説明 |
|------|------|
| `/` | みんなの悩みフィード（全投稿） |
| `/top` | ランディングページ |
| `/senpai` | 先輩データベース一覧（フィルター付き） |
| `/user/[id]` | ユーザープロフィール詳細 |
| `/post` | 投稿ページ（ログイン必須） |
| `/mypage` | マイページ |
| `/auth` | ログイン/新規登録 |
| `/auth/profile` | プロフィール設定・編集 |
| `/auth/reset` | パスワードリセット申請 |
| `/auth/update-password` | パスワード更新 |
| `/auth/callback` | OAuth コールバック |

## DB テーブル構成

- `profiles` — 全ユーザー共通（`user_type: 'married' | 'before'`、`avatar_url` 含む）
- `senpai_profiles` — 既婚ユーザーの詳細データ（`profiles` と 1:1）
- `posts` — 投稿（`post_type: 'married' | 'before'`）
- `comments` — コメント
- `comment_likes` — コメントいいね
- `notifications` — コメント通知（DBトリガーで自動生成）

詳細スキーマは `supabase/schema.sql` および `SPEC.md` 参照。

## デザイントークン

- `--pk*`（ピンク）: 既婚テーマ
- `--tc*`（ティール）: 結婚前テーマ
- `--g*`（グレー）: 汎用
- `--am*`（アンバー）: 警告・バナー

## 現在の状況

実装済み:
- 認証フロー（メール/パスワード、Google OAuth、パスワードリセット）
- プロフィール設定・編集（プロフィール画像アップロード含む）
- 投稿・コメント・いいね機能
- 先輩DB フィルタリング・キーワード検索
- みんなの悩みキーワード検索
- ページネーション（ログイン済みユーザー向け「もっと見る」ボタン）
- コメント通知（DBトリガー + マイページ通知一覧）
- 信頼ポイントバッジ表示（10/50/100/200pt 閾値）
- SEOメタデータ（全ページ title/description/OGP、user/[id] は動的生成）
- RLS ポリシー設定済み

未実装（今後の課題）:
- 管理画面・不適切投稿の報告機能
- プロフィール画像のコメント欄への反映（現在はマイページのみ表示）

## 注意点

- Tailwind v4 を使用。v3 の書き方（`@tailwind base` 等）は使わない
- Next.js 16 (App Router) — `node_modules/next/dist/docs/` に最新ドキュメントあり
- Server Actions は `src/app/actions.ts` に集約
- Supabase クライアントは SSR 対応の `@supabase/ssr` を使用
