# MARILOG 仕様書

## 概要

MARILOG は「結婚のリアルを話せる場所」をコンセプトにした、結婚に関する体験・悩みシェアアプリ。  
既婚ユーザーが経験をデータとして登録し、結婚前ユーザーが参考にできるプラットフォーム。

- **技術スタック**: Next.js 16 (App Router) + Supabase (Auth / PostgreSQL / RLS)
- **スタイリング**: Tailwind v4 (`@import "tailwindcss"`)、CSS カスタムプロパティによるデザイントークン
- **認証**: Supabase Auth（メール/パスワード + Google OAuth）、`@supabase/ssr` による SSR セッション管理

---

## ユーザー種別

| 種別 | 説明 |
|------|------|
| 既婚（married）| 結婚経験あり。先輩 DB に登録され、結婚前ユーザーの参考になる |
| 結婚前（before）| 結婚を考えている段階。先輩のデータを参考にして悩みを相談できる |

---

## ページ一覧

### `/` — みんなの悩み（トップ）

- 全投稿のフィード表示（既婚・結婚前混在）
- `WorryCard` コンポーネントで各投稿を表示
- 未ログインユーザーは投稿閲覧可能、コメント/いいねはログイン促進モーダルが出る

### `/top` — ランディングページ

- アプリの紹介（「結婚のリアルを、話せる場所。」）
- 先輩データベース / みんなの悩みへのカードリンク

### `/senpai` — 先輩データベース

- 既婚ユーザーの登録データ（`senpai_profiles`）を一覧表示
- フィルター: エリア（東日本/西日本/その他/未設定）、満足度（3以上/4以上/5のみ）、状況（結婚継続中/離婚/別居）
- カードクリック → `/user/[id]` でプロフィール詳細を表示

### `/user/[id]` — ユーザープロフィール

- 指定ユーザーのプロフィールと（既婚の場合）先輩DB データを表示
- 既婚: 満足度、結婚のきっかけ、婚礼、ハネムーン、指輪、子供、振り返り、メッセージ
- 結婚前: 不安度、悩みタグ、貯金/収入/仕事/子供の考え
- 存在しないユーザーは 404

### `/post` — 投稿ページ

- ログイン必須
- `profiles.user_type` に応じて `MarriedPostForm` / `BeforePostForm` を切り替え
- 既婚ユーザーが `senpai_profiles` 未登録の場合バナーを表示

### `/mypage` — マイページ

- 未ログイン: ログイン誘導
- ログイン済み・プロフィール未設定: プロフィール入力誘導
- ログイン済み: 自分のプロフィール概要、統計（投稿数/ポイント/コメント数）、メニュー、自分の投稿一覧

### `/auth` — ログイン/新規登録

- タブで新規登録 / ログインを切り替え
- Google OAuth ボタン
- メール/パスワードフォーム
- ログインタブ: 「パスワードをお忘れですか？」→ `/auth/reset`

### `/auth/profile` — プロフィール設定・編集

- 既存プロフィールがある場合は編集モード（タイトル変更・保存後 `/mypage` にリダイレクト）
- 新規の場合は設定モード（保存後 `/` にリダイレクト）
- `user_type` 選択で 既婚/結婚前 の詳細フィールドがインラインで展開

### `/auth/reset` — パスワードリセット申請

- メールアドレス入力 → リセットメール送信

### `/auth/update-password` — パスワード更新

- リセットメールのリンク経由でアクセス
- 新しいパスワードを設定

### `/auth/callback` — OAuth コールバック

- Supabase の PKCE コード交換エンドポイント
- `type=recovery` → `/auth/update-password` にリダイレクト
- 新規ユーザー（プロフィール未登録）→ `/auth/profile` にリダイレクト
- 既存ユーザー → `/` にリダイレクト

---

## データベース設計

### `profiles` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK, FK→auth.users) | ユーザー ID |
| nickname | text | ニックネーム（必須） |
| age | integer | 年齢（必須） |
| gender | text | 性別（男性/女性/その他） |
| area | text | エリア |
| user_type | text | 'married' または 'before' |
| trust_points | integer | 信頼ポイント（デフォルト0） |
| anxiety_level | integer | 不安度 1〜5（結婚前のみ） |
| concern_tags | text[] | 悩みタグ（結婚前のみ） |
| needed_savings | integer | 必要貯金額 万円（結婚前のみ） |
| ring_budget | integer | 指輪予算 万円（結婚前のみ） |
| work_plan | text | 仕事の予定（結婚前のみ） |
| kids_plan | text | 子供の考え（結婚前のみ） |
| created_at | timestamptz | 作成日時 |

### `senpai_profiles` テーブル（既婚ユーザーのみ）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | |
| user_id | uuid (UNIQUE, FK→profiles) | ユーザー ID |
| age_at_marriage | integer | 結婚時の年齢（必須） |
| income | integer | 年収 万円 |
| savings | integer | 貯金額 万円 |
| marriage_triggers | text[] | 結婚のきっかけタグ |
| dating_period | integer | 交際期間 ヶ月 |
| satisfaction | integer | 満足度 1〜5（必須） |
| current_status | text | 現在の状況（結婚継続中/離婚した/別居中） |
| message | text | 結婚前の人へのメッセージ |
| reflection | text | 結婚前に知りたかったこと |
| had_wedding | boolean | 結婚式を挙げたか |
| wedding_cost | integer | 式費用 万円 |
| ceremony_note | text | 式についての感想・メモ |
| had_honeymoon | boolean | ハネムーンに行ったか |
| honeymoon_cost | integer | ハネムーン費用 万円 |
| ring_cost | integer | 指輪費用 万円 |
| kids | text | 子供の状況 |
| created_at | timestamptz | 作成日時 |

### `posts` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | |
| user_id | uuid (FK→profiles) | |
| post_type | text | 'married' / 'before' |
| concern_tags | text[] | 悩みタグ |
| body | text | 本文（必須） |
| anxiety_level | integer | 不安度（結婚前のみ、現在未使用） |
| created_at | timestamptz | |

### `comments` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | |
| post_id | uuid (FK→posts) | |
| user_id | uuid (FK→profiles) | |
| body | text | |
| created_at | timestamptz | |

### `comment_likes` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | |
| comment_id | uuid (FK→comments) | |
| user_id | uuid (FK→profiles) | |
| created_at | timestamptz | |

### `notifications` テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid (PK) | |
| user_id | uuid (FK→auth.users) | 通知の受信者（投稿主） |
| actor_id | uuid (FK→auth.users) | コメントした人 |
| post_id | uuid (FK→posts) | 対象投稿 |
| comment_id | uuid (FK→comments) | 対象コメント |
| is_read | boolean | 既読フラグ（デフォルト false） |
| created_at | timestamptz | |

- DBトリガー `on_comment_created` で自動生成（自分の投稿への自分コメントは生成しない）
- RLS: 受信者本人のみ SELECT / UPDATE 可

---

## 認証フロー

### メール/パスワード 新規登録

1. `/auth` でメール・パスワード入力 → `supabase.auth.signUp()`
2. メール確認が必要な場合: 確認待ち画面（`confirmationSent` state）
3. 確認メールのリンク → `/auth/callback?code=...` → プロフィール未登録なので `/auth/profile` にリダイレクト
4. プロフィール設定 → 保存後 `/` へ

### メール/パスワード ログイン

1. `/auth` でメール・パスワード入力 → `supabase.auth.signInWithPassword()`
2. 成功 → `/` にリダイレクト

### Google OAuth

1. `/auth` の「Googleでログイン」ボタン → `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: .../auth/callback })`
2. Google 認証 → `/auth/callback?code=...`
3. プロフィール未登録なら `/auth/profile`、既登録なら `/` へ

### パスワードリセット

1. ログイン画面 → 「パスワードをお忘れですか？」→ `/auth/reset`
2. メールアドレス入力 → `supabase.auth.resetPasswordForEmail(email, { redirectTo: .../auth/callback?type=recovery })`
3. メール内リンク → `/auth/callback?code=...&type=recovery` → `type=recovery` 判定 → `/auth/update-password`
4. 新パスワード入力 → `supabase.auth.updateUser({ password })` → `/` にリダイレクト

---

## コンポーネント設計

### `Nav` (Server Component)

- アプリロゴのみ表示（ニックネームなし）

### `BottomTabs` (Client Component)

- `position: sticky; top: 50px; borderBottom` でタブをヘッダー直下に固定
- タブ: トップ / 先輩DB / 投稿 / マイページ

### `WorryCard` (Client Component)

- 投稿1件を表示
- 投稿主は `/user/[id]` へのリンク
- 自分の投稿: 削除ボタン（ゴミ箱アイコン）表示 → `confirm()` 後 `deletePost()` 実行
- コメント折りたたみ/展開
- 自分のコメント: いいね不可（アイコンのみ表示）、削除ボタン表示
- 他人のコメント: いいねボタン（`toggleLike()`）、自分がいいね済みならピンク色
- 未ログイン: コメント/いいねボタンタップ → ログイン促進モーダル

### `SenpaiPage` (Client Component)

- フィルターUI（`useState`）でクライアントサイドフィルタリング
- 各カードは `/user/[id]` へリンク

---

## Server Actions (`src/app/actions.ts`)

| 関数 | 説明 |
|------|------|
| `createPost(data)` | 投稿作成。`post_type`, `concern_tags`, `body`, `anxiety_level?` |
| `addComment(postId, body)` | コメント追加（DBトリガーで通知も自動生成） |
| `toggleLike(commentId)` | いいねトグル。自分のコメントへのいいね防止 |
| `deletePost(postId)` | 投稿削除。`user_id` 一致確認（RLS + サーバー側チェック） |
| `deleteComment(commentId)` | コメント削除。`user_id` 一致確認 |
| `markNotificationsRead()` | 未読通知を全て既読にする |

---

## プロフィール設定フォーム（`/auth/profile`）

### 必須項目（全ユーザー共通）

- ニックネーム `*`
- 年齢 `*`
- 性別

### 既婚ユーザー追加項目

**必須**
- 結婚時の年齢 `*`
- 現在の満足度（1〜5）`*`
- 現在の状況 `*`

**任意**
- 年収
- 貯金額
- 交際期間
- 結婚のきっかけ（タグ選択、「その他」選択時テキスト入力）
- 式を挙げたか（はい/いいえ）→ はいの場合: 費用、式についてのメモ
- ハネムーンに行ったか → はいの場合: 費用
- 指輪費用
- 子供
- 結婚前に知りたかったこと
- 結婚前の方へのメッセージ

### 結婚前ユーザー追加項目

**任意**
- 不安度（1〜5 スライダー）
- 今の悩み（タグ選択、「その他」選択時テキスト入力）
- 必要だと思う貯金額
- 指輪予算
- 結婚後の仕事の予定
- 子供についての考え

### 保存処理

- 既婚ユーザー: `profiles` と `senpai_profiles` の両方に upsert（`senpai_profiles` は `onConflict: 'user_id'`）
- 結婚前ユーザー: `profiles` のみ upsert
- 編集モード（既存プロフィールあり）: 保存後 `/mypage` へリダイレクト
- 新規モード: 保存後 `/` へリダイレクト

---

## 「その他」タグ入力パターン

タグ選択で「その他」を選択すると直下にテキスト入力が出現。  
保存時: `buildTags()` / `buildConcernTags()` / `buildTriggerTags()` 関数で「その他」を「その他（入力テキスト）」に変換して保存。

対象箇所:
1. `BeforePostForm` — 悩みタグ
2. `MarriedPostForm` — 悩みカテゴリタグ
3. `/auth/profile` — 結婚前: 今の悩み
4. `/auth/profile` — 既婚: 結婚のきっかけ

---

## 信頼ポイント・バッジ

コメントにいいねを受けると `trust_points` が加算される（DBトリガー `on_comment_liked` / `on_comment_unliked`、+5pt/-5pt）。

バッジはポイント閾値に応じて自動表示（`src/lib/trustBadge.ts`）:

| 閾値 | バッジ名 |
|------|---------|
| 10pt〜 | サポーター |
| 50pt〜 | 信頼の先輩 |
| 100pt〜 | ベテラン |
| 200pt〜 | レジェンド |

マイページのプロフィール欄とコメント欄に表示。

## ページネーション

ゲスト: `GUEST_LIMIT = 10` 件を表示し、超過分はぼかし＋登録CTA。  
ログイン済み: `PAGE_SIZE = 10` 件ずつ表示し「もっと見る」ボタンで追加表示（クライアントサイド制御）。フィルター・タブ・検索変更時にリセット。

## 検索機能

- **みんなの悩み**: 投稿本文・投稿者ニックネームを `includes()` で部分一致検索
- **先輩DB**: ニックネーム・結婚前の方へのメッセージ・結婚の決め手タグを対象に検索

## デザイントークン（CSS カスタムプロパティ）

| 変数 | 説明 |
|------|------|
| `--pk50` 〜 `--pk800` | ピンク（既婚テーマカラー） |
| `--tc50` 〜 `--tc800` | ティール（結婚前テーマカラー） |
| `--g50` 〜 `--g800` | グレー |
| `--am50` 〜 `--am700` | アンバー（警告・バナー） |
| `--bd` | `1px solid var(--g200)`（標準ボーダー） |
| `--rlg` / `--rmd` / `--rsm` | ボーダーラジウス（大/中/小） |

---

## Supabase 設定

### 必要な Provider 設定（Supabase ダッシュボード）

- Authentication → Providers → Email: 有効
- Authentication → Providers → Google: 有効（Client ID / Client Secret 要設定）

### 必要な URL 設定

- Site URL: 本番ドメイン
- Redirect URLs: `http://localhost:3000/auth/callback`, `https://本番ドメイン/auth/callback`

### RLS ポリシー

- `profiles`: 本人のみ更新可、全員閲覧可
- `senpai_profiles`: 本人のみ更新可、全員閲覧可
- `posts`: 本人のみ作成・削除、全員閲覧可
- `comments`: 本人のみ作成・削除、ログイン済みユーザーのみ閲覧
- `comment_likes`: 本人のみ作成・削除

---

## 未実装・今後の課題

- 管理画面・不適切投稿の報告機能
- プロフィール画像のコメント欄への反映（現在はマイページのみ表示）
- サーバーサイドページネーション（現在はクライアント側で表示件数を制御）

---

## SQL マイグレーション

`supabase/schema.sql` を Supabase SQL Editor で実行することで全テーブル・RLS・トリガーが構築される（冪等。何度実行しても安全）。

個別に追加したカラム（実施済み）:
- `profiles.avatar_url` TEXT — プロフィール画像URL
- `profiles` への結婚前ユーザー用カラム群（`needed_savings`, `ring_budget`, `work_plan`, `kids_plan`, `anxiety_level`, `concern_tags`）
- `senpai_profiles.ceremony_note` TEXT — 式についてのメモ
- `notifications` テーブル — コメント通知（DBトリガーで自動生成）

Supabase Storage:
- `avatars` バケットを作成し Public access を ON にすること
- Storage ポリシーを設定すること（本人のみアップロード可、全員閲覧可）
