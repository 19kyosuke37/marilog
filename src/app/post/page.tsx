import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MarriedPostForm from './MarriedPostForm'
import BeforePostForm from './BeforePostForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '投稿する | MARILOG',
  description: '結婚にまつわる悩みや体験を投稿しよう。',
}

export default async function PostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <i className="ti ti-pencil-plus" style={{ fontSize: 48, color: 'var(--pk400)', display: 'block', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.5rem' }}>投稿して参加する</h3>
        <p style={{ fontSize: 13, color: 'var(--g600)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          投稿すると先輩のコメントや詳細データが<br />
          閲覧できるようになります。<br />
          アカウント登録は無料・1分で完了します。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280, margin: '0 auto' }}>
          <Link href="/auth" style={{
            padding: 13, background: 'var(--pk400)', color: '#fff',
            borderRadius: 'var(--rmd)', fontSize: 15, fontWeight: 600,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>
            新規登録して投稿する
          </Link>
          <Link href="/auth" style={{
            padding: 13, background: 'var(--g100)', color: 'var(--g800)',
            borderRadius: 'var(--rmd)', fontSize: 14,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>
            ログイン
          </Link>
        </div>
      </div>
    )
  }

  const [{ data: profile }, { data: senpai }] = await Promise.all([
    supabase.from('profiles').select('user_type, nickname').eq('id', user.id).single(),
    supabase.from('senpai_profiles').select('user_id').eq('user_id', user.id).maybeSingle(),
  ])

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ fontSize: 14, color: 'var(--g600)', marginBottom: '1rem' }}>
          プロフィールの設定が必要です
        </p>
        <Link href="/auth/profile" style={{
          padding: '11px 24px', background: 'var(--pk400)', color: '#fff',
          borderRadius: 'var(--rmd)', fontSize: 14, fontWeight: 600,
          textDecoration: 'none', display: 'inline-block',
        }}>
          プロフィールを設定する
        </Link>
      </div>
    )
  }

  const userType = (profile as { user_type: string; nickname: string }).user_type

  if (userType === 'married') {
    return <MarriedPostForm hasSenpai={!!senpai} />
  }
  return <BeforePostForm />
}
