'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { addComment, toggleLike, deletePost, deleteComment } from '@/app/actions'
import type { Post } from '@/types'
import { getTrustBadge } from '@/lib/trustBadge'

const SAT_LABELS: Record<number, string> = {
  1: '後悔', 2: 'あまりよくない', 3: '普通', 4: '満足', 5: 'とても満足',
}
const SAT_COLORS: Record<number, string> = {
  1: '#F09595', 2: '#EF9F27', 3: '#FAC775', 4: '#9FE1CB', 5: '#1D9E75',
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function ageGroup(age: number | null): string {
  if (!age) return ''
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  return '40代以上'
}

type Props = {
  post: Post
  currentUserId: string | null
}

export default function WorryCard({ post, currentUserId }: Props) {
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const isMarried = post.post_type === 'married'
  const isOwnPost = post.user_id === currentUserId
  const metaParts = [post.nickname, ageGroup(post.age), post.area].filter(Boolean)

  function handleToggleComment() {
    if (!currentUserId) { setShowLoginModal(true); return }
    setCommentOpen(v => !v)
  }

  function handleSubmitComment() {
    const text = commentText.trim()
    if (!text || !currentUserId) return
    setCommentText('')
    startTransition(async () => {
      await addComment(post.id, text)
      router.refresh()
    })
  }

  function handleLike(commentId: string) {
    if (!currentUserId) { setShowLoginModal(true); return }
    startTransition(async () => {
      await toggleLike(commentId)
      router.refresh()
    })
  }

  function handleDeletePost() {
    if (!confirm('この投稿を削除しますか？')) return
    startTransition(async () => {
      await deletePost(post.id)
      router.refresh()
    })
  }

  function handleDeleteComment(commentId: string) {
    if (!confirm('このコメントを削除しますか？')) return
    startTransition(async () => {
      await deleteComment(commentId)
      router.refresh()
    })
  }

  return (
    <>
      <div style={{
        background: '#fff',
        border: 'var(--bd)',
        borderRadius: 'var(--rlg)',
        padding: '1rem 1.1rem',
        marginBottom: 10,
      }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
          <span style={{
            fontSize: 11, padding: '3px 9px', borderRadius: 999, fontWeight: 600,
            background: isMarried ? 'var(--pk50)' : 'var(--tc50)',
            color: isMarried ? 'var(--pk800)' : 'var(--tc800)',
            flexShrink: 0,
          }}>
            {isMarried ? '既婚' : '結婚前'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href={`/user/${post.user_id}`} style={{
                fontSize: 12, color: 'var(--g600)', textDecoration: 'none',
                borderBottom: '1px solid var(--g200)',
              }}>
                {metaParts.join('・')}
              </Link>
              {isOwnPost && (
                <button
                  onClick={handleDeletePost}
                  disabled={isPending}
                  title="投稿を削除"
                  style={{
                    background: 'none', border: 'none', padding: '2px 4px',
                    color: 'var(--g400)', cursor: 'pointer', fontSize: 13,
                    lineHeight: 1,
                  }}
                >
                  <i className="ti ti-trash" />
                </button>
              )}
            </div>
            <span style={{ fontSize: 11, color: 'var(--g400)', fontStyle: 'italic' }}>
              投稿日時：{formatDateTime(post.created_at)}
            </span>
          </div>
        </div>

        {/* タグ */}
        {post.concern_tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '.5rem' }}>
            {post.concern_tags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: 'var(--g100)', color: 'var(--g600)', border: 'var(--bd)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 本文 */}
        <div style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.65, marginBottom: '.6rem' }}>
          {post.body}
        </div>

        {/* 満足度バー（既婚のみ） */}
        {isMarried && post.satisfaction && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '.6rem' }}>
            <span style={{ fontSize: 11, color: 'var(--g600)', minWidth: 72 }}>
              {SAT_LABELS[post.satisfaction]}
            </span>
            <div style={{ flex: 1, height: 5, background: 'var(--g100)', borderRadius: 3 }}>
              <div style={{
                height: 5, borderRadius: 3,
                width: `${(post.satisfaction / 5) * 100}%`,
                background: SAT_COLORS[post.satisfaction],
              }} />
            </div>
          </div>
        )}

        {/* コメントセクション */}
        <div style={{ borderTop: 'var(--bd)', paddingTop: '.85rem', marginTop: '.75rem' }}>
          <button
            onClick={handleToggleComment}
            style={{
              background: 'none', border: 'none', fontSize: 12,
              color: 'var(--g600)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4, padding: 0,
            }}
          >
            <i className="ti ti-message-circle" style={{ fontSize: 13 }} />
            コメント（{post.comments.length}）
          </button>

          {commentOpen && (
            <div style={{ marginTop: 8 }}>
              {post.comments.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 8 }}>
                  まだコメントがありません
                </p>
              )}
              {post.comments.map(comment => (
                <div key={comment.id} style={{
                  background: 'var(--g50)', borderRadius: 'var(--rsm)',
                  padding: '.65rem .85rem', marginBottom: 6,
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, flexWrap: 'wrap',
                  }}>
                    <i className="ti ti-user-circle" style={{ fontSize: 14 }} />
                    {comment.nickname}
                    <span style={{
                      fontSize: 10, background: 'var(--am50)', color: 'var(--am600)',
                      padding: '1px 6px', borderRadius: 999,
                    }}>
                      {comment.trust_points}pt
                    </span>
                    {(() => {
                      const b = getTrustBadge(comment.trust_points)
                      return b ? (
                        <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 999, background: b.bg, color: b.color, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <i className={`ti ${b.icon}`} style={{ fontSize: 10 }} />{b.label}
                        </span>
                      ) : null
                    })()}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.55 }}>
                    {comment.body}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    {comment.user_id !== currentUserId ? (
                      <button
                        onClick={() => handleLike(comment.id)}
                        disabled={isPending}
                        style={{
                          background: 'none', border: 'none', fontSize: 11,
                          color: comment.liked_by_me ? 'var(--pk400)' : 'var(--g600)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0,
                        }}
                      >
                        <i className="ti ti-thumb-up" style={{ fontSize: 12 }} />
                        参考になった {comment.likes_count}
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--g400)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <i className="ti ti-thumb-up" style={{ fontSize: 12 }} />
                        参考になった {comment.likes_count}
                      </span>
                    )}
                    {comment.user_id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isPending}
                        title="コメントを削除"
                        style={{
                          background: 'none', border: 'none', padding: '0 2px',
                          color: 'var(--g400)', cursor: 'pointer', fontSize: 12,
                          marginLeft: 'auto', lineHeight: 1,
                        }}
                      >
                        <i className="ti ti-trash" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <input
                  className="cinput"
                  placeholder="コメントを入力..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  disabled={isPending}
                />
                <button
                  className="csend"
                  onClick={handleSubmitComment}
                  disabled={isPending || !commentText.trim()}
                >
                  送信
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ログイン促進モーダル */}
      {showLoginModal && (
        <div
          onClick={e => e.target === e.currentTarget && setShowLoginModal(false)}
          style={{
            display: 'flex', position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.45)', zIndex: 200,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: 'var(--rlg)',
            padding: '1.75rem 1.5rem', maxWidth: 340, width: '90%', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, color: 'var(--pk400)', marginBottom: '.6rem' }}>
              <i className="ti ti-lock" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: '.4rem' }}>
              投稿するとコメントが読めます
            </h3>
            <p style={{ fontSize: 13, color: 'var(--g600)', marginBottom: '1.1rem', lineHeight: 1.6 }}>
              登録不要・1分で完了します。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="/auth"
                style={{
                  padding: 11, background: 'var(--pk400)', color: '#fff',
                  border: 'none', borderRadius: 'var(--rmd)', fontSize: 14,
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'block',
                }}
              >
                <i className="ti ti-pencil" /> 登録して全コメントを見る
              </a>
              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  padding: 11, background: 'none', color: 'var(--g600)',
                  border: 'var(--bd)', borderRadius: 'var(--rmd)', fontSize: 14, cursor: 'pointer',
                }}
              >
                あとで
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
