import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import MypageClient from './MypageClient'

export const metadata: Metadata = {
  title: 'マイページ | MARILOG',
  description: '投稿・コメント・信頼ポイントなど、あなたの活動をまとめて確認できます。',
}

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <i className="ti ti-user-circle" style={{ fontSize: 48, color: 'var(--pk400)', display: 'block', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.5rem' }}>マイページ</h3>
        <p style={{ fontSize: 13, color: 'var(--g600)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          ログインするとマイページが利用できます
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280, margin: '0 auto' }}>
          <Link href="/auth" style={{
            padding: 13, background: 'var(--pk400)', color: '#fff',
            borderRadius: 'var(--rmd)', fontSize: 15, fontWeight: 600,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>
            新規登録 / ログイン
          </Link>
        </div>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--pk50)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, margin: '0 auto 1rem',
          border: '2px solid var(--pk100)',
        }}>
          <i className="ti ti-user-circle" style={{ color: 'var(--pk400)' }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.5rem' }}>プロフィールが未設定です</h3>
        <p style={{ fontSize: 13, color: 'var(--g600)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          プロフィールを入力すると投稿・コメントができます
        </p>
        <Link href="/auth/profile" style={{
          padding: '13px 28px', background: 'var(--pk400)', color: '#fff',
          borderRadius: 'var(--rmd)', fontSize: 15, fontWeight: 600,
          textDecoration: 'none', display: 'inline-block',
        }}>
          プロフィールを入力する →
        </Link>
      </div>
    )
  }

  const [{ count: postCount }, { count: commentCount }, { data: posts }, { data: notifRaw }] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('posts')
      .select('id, post_type, body, concern_tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('notifications')
      .select('id, post_id, actor_id, is_read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const notifActorIds = [...new Set((notifRaw ?? []).map((n: { actor_id: string | null }) => n.actor_id).filter(Boolean) as string[])]
  let notifActors: { id: string; nickname: string }[] = []
  if (notifActorIds.length) {
    const { data } = await supabase.from('profiles').select('id, nickname').in('id', notifActorIds)
    notifActors = (data ?? []) as { id: string; nickname: string }[]
  }

  const notifications = (notifRaw ?? []).map((n: { id: string; post_id: string; actor_id: string | null; is_read: boolean; created_at: string }) => ({
    id: n.id,
    post_id: n.post_id,
    actor_nickname: notifActors.find(a => a.id === n.actor_id)?.nickname ?? 'ユーザー',
    is_read: n.is_read,
    created_at: n.created_at,
  }))

  return (
    <MypageClient
      profile={profile as {
        nickname: string
        age: number | null
        gender: string | null
        user_type: 'married' | 'before'
        trust_points: number
        avatar_url: string | null
        updated_at: string | null
      }}
      postCount={postCount ?? 0}
      commentCount={commentCount ?? 0}
      email={user.email ?? ''}
      posts={(posts ?? []) as {
        id: string
        post_type: 'married' | 'before'
        body: string
        concern_tags: string[]
        created_at: string
      }[]}
      notifications={notifications}
    />
  )
}
