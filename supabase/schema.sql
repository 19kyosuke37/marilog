-- ════════════════════════════════════════════════════════════════
-- MARILOG — 完全スキーマ定義
-- このファイル1本で現在の DB の完全な姿を表しています。
-- 新規環境・既存環境どちらでも何度でも安全に実行できます。
-- ════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────────
-- profiles: ユーザープロフィール
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                       UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname                 TEXT NOT NULL,
  gender                   TEXT CHECK (gender IN ('男性', '女性', 'その他')),
  age                      INTEGER,
  user_type                TEXT NOT NULL CHECK (user_type IN ('married', 'before')),
  trust_points             INTEGER NOT NULL DEFAULT 0,
  avatar_url               TEXT,
  anxiety_level            INTEGER,
  concern_tags             TEXT[] NOT NULL DEFAULT '{}',
  needed_savings           INTEGER,
  ring_budget              INTEGER,
  work_plan                TEXT,
  kids_plan                TEXT,
  worry_note               TEXT,
  current_age              INTEGER,
  current_income           INTEGER,
  current_household_income INTEGER,
  current_savings          INTEGER,
  current_kids_count       INTEGER,
  current_note             TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 既存DBへのカラム追加（新規DBでは上の CREATE TABLE が全カラムを含むので無害）
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url               TEXT,
  ADD COLUMN IF NOT EXISTS anxiety_level            INTEGER,
  ADD COLUMN IF NOT EXISTS concern_tags             TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS needed_savings           INTEGER,
  ADD COLUMN IF NOT EXISTS ring_budget              INTEGER,
  ADD COLUMN IF NOT EXISTS work_plan                TEXT,
  ADD COLUMN IF NOT EXISTS kids_plan                TEXT,
  ADD COLUMN IF NOT EXISTS worry_note               TEXT,
  ADD COLUMN IF NOT EXISTS current_age              INTEGER,
  ADD COLUMN IF NOT EXISTS current_income           INTEGER,
  ADD COLUMN IF NOT EXISTS current_household_income INTEGER,
  ADD COLUMN IF NOT EXISTS current_savings          INTEGER,
  ADD COLUMN IF NOT EXISTS current_kids_count       INTEGER,
  ADD COLUMN IF NOT EXISTS current_note             TEXT;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────
-- senpai_profiles: 先輩データベース（既婚者のみ）
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.senpai_profiles (
  id                         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id                    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  age_at_marriage            INTEGER,
  partner_age_at_marriage    INTEGER,
  income_at_marriage         INTEGER,
  partner_income_at_marriage INTEGER,
  saving_at_marriage         INTEGER,
  partner_saving_at_marriage INTEGER,
  cohabitation               TEXT CHECK (cohabitation IN ('yes', 'no')),
  cohabitation_period        TEXT,
  area                       TEXT,
  dating_period              TEXT,
  marriage_triggers          TEXT[] NOT NULL DEFAULT '{}',
  satisfaction               INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  current_status             TEXT,
  reflection                 TEXT,
  message_to_undecided       TEXT,
  engagement_ring            INTEGER,
  wedding_ring               INTEGER,
  wedding_cost               INTEGER,
  honeymoon_cost             INTEGER,
  ceremony_note              TEXT,
  has_kids                   TEXT CHECK (has_kids IN ('yes', 'no', 'plan')),
  kids_count                 INTEGER,
  first_child_year           INTEGER,
  first_child_saving         INTEGER,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.senpai_profiles
  ADD COLUMN IF NOT EXISTS partner_income_at_marriage INTEGER,
  ADD COLUMN IF NOT EXISTS partner_saving_at_marriage INTEGER,
  ADD COLUMN IF NOT EXISTS cohabitation               TEXT CHECK (cohabitation IN ('yes', 'no')),
  ADD COLUMN IF NOT EXISTS cohabitation_period        TEXT,
  ADD COLUMN IF NOT EXISTS ceremony_note              TEXT;

ALTER TABLE public.senpai_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Senpai profiles viewable by everyone" ON public.senpai_profiles;
CREATE POLICY "Senpai profiles viewable by everyone"
  ON public.senpai_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own senpai profile" ON public.senpai_profiles;
CREATE POLICY "Users can insert own senpai profile"
  ON public.senpai_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own senpai profile" ON public.senpai_profiles;
CREATE POLICY "Users can update own senpai profile"
  ON public.senpai_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- posts: 悩み投稿
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_type     TEXT NOT NULL CHECK (post_type IN ('married', 'before')),
  concern_tags  TEXT[] NOT NULL DEFAULT '{}',
  body          TEXT NOT NULL,
  anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 5),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert posts" ON public.posts;
CREATE POLICY "Authenticated users can insert posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- comments: コメント
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id    UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by everyone" ON public.comments;
CREATE POLICY "Comments viewable by everyone"
  ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can comment" ON public.comments;
CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- comment_likes: コメントへのいいね
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (comment_id, user_id)
);

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comment likes viewable by everyone" ON public.comment_likes;
CREATE POLICY "Comment likes viewable by everyone"
  ON public.comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like" ON public.comment_likes;
CREATE POLICY "Authenticated users can like"
  ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike" ON public.comment_likes;
CREATE POLICY "Users can unlike"
  ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- トリガー: いいね時に trust_points を自動加減算
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_comment_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET trust_points = trust_points + 5
  WHERE id = (SELECT user_id FROM public.comments WHERE id = NEW.comment_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_liked ON public.comment_likes;
CREATE TRIGGER on_comment_liked
  AFTER INSERT ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_like();

CREATE OR REPLACE FUNCTION public.handle_comment_unlike()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET trust_points = GREATEST(0, trust_points - 5)
  WHERE id = (SELECT user_id FROM public.comments WHERE id = OLD.comment_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_unliked ON public.comment_likes;
CREATE TRIGGER on_comment_unliked
  AFTER DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_unlike();

-- ────────────────────────────────────────────────────────────────
-- notifications: コメント通知
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  actor_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_owner_id UUID;
BEGIN
  SELECT user_id INTO post_owner_id FROM public.posts WHERE id = NEW.post_id;
  IF post_owner_id IS NOT NULL AND post_owner_id <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, actor_id, post_id, comment_id)
    VALUES (post_owner_id, NEW.user_id, NEW.post_id, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_created ON public.comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment_notification();

-- ────────────────────────────────────────────────────────────────
-- ビュー: コメントのいいね数を含む（参考用）
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.comments_with_likes AS
SELECT
  c.*,
  p.nickname     AS author_nickname,
  p.trust_points AS author_trust_points,
  COUNT(cl.id)   AS likes_count
FROM public.comments c
JOIN public.profiles p ON p.id = c.user_id
LEFT JOIN public.comment_likes cl ON cl.comment_id = c.id
GROUP BY c.id, p.nickname, p.trust_points;
