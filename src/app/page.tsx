import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import WorriesPage from '@/components/worries/WorriesPage'
import type { Post, Profile } from '@/types'

export const metadata: Metadata = {
  title: 'みんなの悩み | MARILOG',
  description: '結婚にまつわるリアルな悩みや体験談が集まるフィード。既婚者・結婚前の方が本音で語り合えます。',
  openGraph: {
    title: 'みんなの悩み | MARILOG',
    description: '結婚にまつわるリアルな悩みや体験談が集まるフィード。',
    type: 'website',
  },
}

type RawPost = {
  id: string; user_id: string; post_type: 'married' | 'before'
  concern_tags: string[]; body: string; anxiety_level: number | null; created_at: string
}
type RawProfile = { id: string; nickname: string; age: number | null }
type RawSenpai = { user_id: string; area: string | null; satisfaction: number | null }
type RawComment = { id: string; post_id: string; body: string; created_at: string; user_id: string }
type RawCommentProfile = { id: string; nickname: string; trust_points: number }
type RawLike = { comment_id: string; user_id: string }

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag: initialTag } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: postsRaw } = await supabase
    .from('posts')
    .select('id, user_id, post_type, concern_tags, body, anxiety_level, created_at')
    .order('created_at', { ascending: false })

  const posts = (postsRaw ?? []) as RawPost[]
  const userIds = [...new Set(posts.map(p => p.user_id))]
  const postIds = posts.map(p => p.id)
  const safeIds = (ids: string[]) => ids.length ? ids : ['_placeholder_']

  const [profilesRes, senpaiRes, commentsRes] = await Promise.all([
    supabase.from('profiles').select('id, nickname, age').in('id', safeIds(userIds)),
    supabase.from('senpai_profiles').select('user_id, area, satisfaction').in('user_id', safeIds(userIds)),
    supabase.from('comments').select('id, post_id, body, created_at, user_id')
      .in('post_id', safeIds(postIds)).order('created_at', { ascending: true }),
  ])

  const comments = (commentsRes.data ?? []) as RawComment[]
  const commentUserIds = [...new Set(comments.map(c => c.user_id))]
  const commentIds = comments.map(c => c.id)

  const [commentProfilesRes, likesRes] = await Promise.all([
    supabase.from('profiles').select('id, nickname, trust_points').in('id', safeIds(commentUserIds)),
    supabase.from('comment_likes').select('comment_id, user_id').in('comment_id', safeIds(commentIds)),
  ])

  const profilesData = (profilesRes.data ?? []) as RawProfile[]
  const senpaiData = (senpaiRes.data ?? []) as RawSenpai[]
  const commentProfilesData = (commentProfilesRes.data ?? []) as RawCommentProfile[]
  const likesData = (likesRes.data ?? []) as RawLike[]

  let currentProfile: Profile | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname, age, gender, user_type, trust_points')
      .eq('id', user.id)
      .single()
    currentProfile = data as Profile | null
  }

  const assembled: Post[] = posts.map(post => {
    const profile = profilesData.find(p => p.id === post.user_id)
    const senpai = senpaiData.find(s => s.user_id === post.user_id)
    const postComments = comments
      .filter(c => c.post_id === post.id)
      .map(comment => {
        const cp = commentProfilesData.find(p => p.id === comment.user_id)
        const likes = likesData.filter(l => l.comment_id === comment.id)
        return {
          ...comment,
          nickname: cp?.nickname ?? 'ユーザー',
          trust_points: cp?.trust_points ?? 0,
          likes_count: likes.length,
          liked_by_me: user ? likes.some(l => l.user_id === user.id) : false,
        }
      })
    return {
      ...post,
      nickname: profile?.nickname ?? 'ユーザー',
      age: profile?.age ?? null,
      area: senpai?.area ?? null,
      satisfaction: senpai?.satisfaction ?? null,
      comments: postComments,
    }
  })

  return (
    <WorriesPage
      initialPosts={assembled}
      currentUserId={user?.id ?? null}
      currentProfile={currentProfile}
      initialTag={initialTag ?? null}
    />
  )
}
