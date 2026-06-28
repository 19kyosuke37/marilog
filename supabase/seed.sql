-- テスト用の投稿データ（匿名ユーザー分）
-- ※ profiles.id は auth.users.id を参照するため、
--   実際のユーザーでログインしてから投稿するのが正しいフロー
-- このseedはデモ表示確認用のダミーデータです

-- ダミーユーザーをauth.usersに直接追加はできないため、
-- Supabase Dashboard > Table Editor > posts で手動追加するか、
-- 登録後に投稿フォームから投稿してください。

-- 登録済みユーザーのIDに差し替えて使う場合のサンプル:
/*
INSERT INTO public.posts (user_id, post_type, concern_tags, body, anxiety_level)
VALUES
  ('YOUR_USER_ID_HERE', 'before', ARRAY['お金・貯金が不安', 'タイミングがわからない'],
   '付き合って2年半。彼氏は結婚を考えてるみたいだけど貯金が少なくて踏み出せない。アドバイスほしいです。', 4),
  ('YOUR_USER_ID_HERE', 'married', ARRAY['家事・育児の分担'],
   '子どもが生まれてから生活が一変。大変だけど充実している。同じ状況の人と話したい。', NULL);
*/
