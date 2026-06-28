'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { deletePost, markNotificationsRead } from '@/app/actions'
import { getTrustBadge } from '@/lib/trustBadge'

type MypagePost = {
  id: string
  post_type: 'married' | 'before'
  body: string
  concern_tags: string[]
  created_at: string
}

type Notification = {
  id: string
  post_id: string
  actor_nickname: string
  is_read: boolean
  created_at: string
}

type Props = {
  profile: {
    nickname: string
    age: number | null
    gender: string | null
    user_type: 'married' | 'before'
    trust_points: number
    avatar_url: string | null
    updated_at: string | null
  }
  postCount: number
  commentCount: number
  email: string
  posts: MypagePost[]
  notifications: Notification[]
}

function ageGroup(age: number | null) {
  if (!age) return ''
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  return '40代以上'
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

export default function MypageClient({ profile, postCount, commentCount, email, posts, notifications }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const unreadCount = notifications.filter(n => !n.is_read).length

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleDeletePost(postId: string) {
    if (!confirm('この投稿を削除しますか？')) return
    startTransition(async () => {
      await deletePost(postId)
      router.refresh()
    })
  }

  const subText = [profile.user_type === 'married' ? '既婚' : '結婚前', ageGroup(profile.age)].filter(Boolean).join('・')
  const badge = getTrustBadge(profile.trust_points)

  return (
    <>
      {/* ヘッダー */}
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem 1rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--pk50)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, margin: '0 auto .75rem',
          border: '2px solid var(--pk100)', overflow: 'hidden',
        }}>
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <i className="ti ti-user-circle" style={{ color: 'var(--pk400)' }} />
          )}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{profile.nickname}</div>
        <div style={{ fontSize: 12, color: 'var(--g600)' }}>{subText}</div>
        {badge && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '3px 10px', borderRadius: 999, background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 600 }}>
            <i className={`ti ${badge.icon}`} style={{ fontSize: 12 }} />
            {badge.label}
          </div>
        )}
        {profile.updated_at && (
          <div style={{ fontSize: 10, color: 'var(--g400)', marginTop: 4 }}>
            最終更新日：{formatDate(profile.updated_at)}
          </div>
        )}
      </div>

      {/* スタッツ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: '1.25rem' }}>
        {[
          { num: postCount, label: '投稿数' },
          { num: profile.trust_points, label: 'ポイント' },
          { num: commentCount, label: 'コメント数' },
        ].map(({ num, label }) => (
          <div key={label} style={{
            background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rmd)',
            padding: '.75rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--pk400)' }}>{num}</div>
            <div style={{ fontSize: 11, color: 'var(--g600)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 通知 */}
      {notifications.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.75rem' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--g700)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-bell" style={{ color: 'var(--pk400)' }} />
              通知
              {unreadCount > 0 && (
                <span style={{ background: 'var(--pk400)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999 }}>
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => startTransition(async () => { await markNotificationsRead(); router.refresh() })}
                disabled={isPending}
                style={{ fontSize: 11, color: 'var(--g500)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                全て既読にする
              </button>
            )}
          </div>
          <div style={{ background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rlg)', overflow: 'hidden' }}>
            {notifications.map(n => (
              <Link key={n.id} href={`/?post=${n.post_id}`} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '.8rem 1rem', borderBottom: 'var(--bd)',
                textDecoration: 'none', color: 'var(--g800)',
                background: n.is_read ? '#fff' : 'var(--pk50)',
              }}>
                <i className="ti ti-message-circle" style={{ fontSize: 16, color: 'var(--pk400)', marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{n.actor_nickname}</span>さんがあなたの投稿にコメントしました
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--g500)', marginTop: 2 }}>{formatDate(n.created_at)}</div>
                </div>
                {!n.is_read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pk400)', flexShrink: 0, marginTop: 4 }} />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* メニュー */}
      <div style={{ background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rlg)', overflow: 'hidden', marginBottom: '1rem' }}>
        {[
          { icon: 'ti-pencil', label: '悩みを投稿する', href: '/post' },
          { icon: 'ti-user-edit', label: 'プロフィールを編集する', href: '/auth/profile' },
        ].map(({ icon, label, href }) => (
          <a key={href} href={href} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '.9rem 1.1rem', borderBottom: 'var(--bd)',
            textDecoration: 'none', color: 'var(--g800)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <i className={`ti ${icon}`} style={{ fontSize: 18, color: 'var(--g600)' }} />
              {label}
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 16, color: 'var(--g600)' }} />
          </a>
        ))}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '.9rem 1.1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <i className="ti ti-mail" style={{ fontSize: 18, color: 'var(--g600)' }} />
            {email}
          </div>
        </div>
      </div>

      {/* 自分の投稿一覧 */}
      {posts.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--g700)', marginBottom: '.75rem' }}>
            <i className="ti ti-list" style={{ marginRight: 5 }} />
            自分の投稿
          </h3>
          {posts.map(post => (
            <div key={post.id} style={{
              background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rmd)',
              padding: '.85rem 1rem', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.4rem' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 999, fontWeight: 600,
                    background: post.post_type === 'married' ? 'var(--pk50)' : 'var(--tc50)',
                    color: post.post_type === 'married' ? 'var(--pk800)' : 'var(--tc800)',
                  }}>
                    {post.post_type === 'married' ? '既婚' : '結婚前'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--g400)' }}>{formatDate(post.created_at)}</span>
                </div>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={isPending}
                  title="削除"
                  style={{
                    background: 'none', border: 'none', padding: '2px 4px',
                    color: 'var(--g400)', cursor: 'pointer', fontSize: 13, lineHeight: 1,
                  }}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
              {post.concern_tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '.35rem' }}>
                  {post.concern_tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 999,
                      background: 'var(--g100)', color: 'var(--g600)', border: 'var(--bd)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.55, margin: 0 }}>
                {post.body.length > 80 ? post.body.slice(0, 80) + '…' : post.body}
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          width: '100%', padding: 13, background: 'none',
          border: 'var(--bd)', borderRadius: 'var(--rmd)',
          fontSize: 14, color: 'var(--g600)', cursor: 'pointer',
        }}
      >
        ログアウト
      </button>
    </>
  )
}
