'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WorryCard from './WorryCard'
import type { Post, Profile } from '@/types'

type Tab = 'all' | 'married' | 'before'

const GUEST_LIMIT = 10
const PAGE_SIZE = 10

const MARRIED_TAGS = ['家事・育児の分担', 'お金・家計', '義実家・親族関係', 'コミュニケーション不足', '仕事とのバランス', '子育て', 'セックスレス', '離婚を考えている', 'その他']
const BEFORE_TAGS = ['お金・貯金が不安', 'タイミングがわからない', '相手との温度差', 'そもそも結婚すべきか', '子どものこと', '住む場所', '仕事とのバランス', '親への紹介・挨拶', '相手の収入が不安', '自分の気持ちが揺れている', '性の不一致・相性が不安', 'その他']
const ALL_TAGS = [...new Set([...MARRIED_TAGS, ...BEFORE_TAGS])]

type Props = {
  initialPosts: Post[]
  currentUserId: string | null
  currentProfile: Profile | null
  initialTag?: string | null
}

function GuestCta({ remaining: _ }: { remaining: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ fontSize: 28, color: 'var(--g400)', marginBottom: '.5rem' }}>
        <i className="ti ti-lock" />
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: '.35rem' }}>
        さらに投稿を見るには登録が必要です
      </p>
      <p style={{ fontSize: 12, color: 'var(--g500)', marginBottom: '1rem' }}>
        登録無料・1分で完了します
      </p>
      <Link href="/auth" style={{
        display: 'inline-block', padding: '11px 28px',
        background: 'var(--pk400)', color: '#fff',
        borderRadius: 'var(--rmd)', fontSize: 14, fontWeight: 600,
        textDecoration: 'none',
      }}>
        新規登録して全件を見る →
      </Link>
      <div style={{ marginTop: '.75rem' }}>
        <Link href="/auth" style={{ fontSize: 12, color: 'var(--g600)', textDecoration: 'none', borderBottom: '1px solid var(--g300)' }}>
          すでにアカウントをお持ちの方はログイン
        </Link>
      </div>
    </div>
  )
}

export default function WorriesPage({ initialPosts, currentUserId, currentProfile: _, initialTag }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const [tagFilter, setTagFilter] = useState<string | null>(initialTag ?? null)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [tab, tagFilter, searchQuery])

  const tabTags = tab === 'married' ? MARRIED_TAGS : tab === 'before' ? BEFORE_TAGS : ALL_TAGS

  const q = searchQuery.trim().toLowerCase()
  const filtered = initialPosts.filter(p => {
    if (tab !== 'all' && p.post_type !== tab) return false
    if (tagFilter) {
      const tags = p.concern_tags ?? []
      if (!tags.some(t => t === tagFilter || t.startsWith(tagFilter + '（'))) return false
    }
    if (q && !p.body.toLowerCase().includes(q) && !p.nickname.toLowerCase().includes(q)) return false
    return true
  })

  const isGuest = !currentUserId
  const visible = isGuest ? filtered.slice(0, GUEST_LIMIT) : filtered.slice(0, visibleCount)
  const peek = isGuest ? filtered.slice(GUEST_LIMIT, GUEST_LIMIT + 2) : []
  const hasGuestMore = isGuest && filtered.length > GUEST_LIMIT
  const hasMore = hasGuestMore || (!isGuest && visibleCount < filtered.length)

  function switchTab(t: Tab) { setTab(t); setTagFilter(null) }

  const tabs: [Tab, string][] = [['all', 'すべて'], ['married', '既婚'], ['before', '結婚前']]

  return (
    <>
      <div className="section-title">みんなの悩み</div>

      {/* 検索 */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--g400)', fontSize: 14 }} />
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '8px 10px 8px 32px', fontSize: 13,
            border: 'var(--bd)', borderRadius: 'var(--rmd)', outline: 'none',
            background: '#fff', boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--g400)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
          >
            <i className="ti ti-x" />
          </button>
        )}
      </div>

      {/* タブ */}
      <div style={{ display: 'flex', borderBottom: 'var(--bd)', marginBottom: '1rem' }}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            style={{
              padding: '9px 14px',
              fontSize: 13,
              color: tab === key ? 'var(--pk600)' : 'var(--g600)',
              cursor: 'pointer',
              border: 'none',
              borderBottom: `2px solid ${tab === key ? 'var(--pk400)' : 'transparent'}`,
              background: 'none',
              fontWeight: tab === key ? 600 : 400,
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* タグ絞り込み */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => setTagFilter(null)}
          style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
            border: '1px solid',
            borderColor: tagFilter === null ? 'var(--pk400)' : 'var(--g200)',
            background: tagFilter === null ? 'var(--pk50)' : '#fff',
            color: tagFilter === null ? 'var(--pk800)' : 'var(--g600)',
            fontWeight: tagFilter === null ? 600 : 400,
          }}
        >
          すべて
        </button>
        {tabTags.map(tag => (
          <button
            key={tag}
            onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
            style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
              border: '1px solid',
              borderColor: tagFilter === tag ? 'var(--pk400)' : 'var(--g200)',
              background: tagFilter === tag ? 'var(--pk50)' : '#fff',
              color: tagFilter === tag ? 'var(--pk800)' : 'var(--g600)',
              fontWeight: tagFilter === tag ? 600 : 400,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: '.75rem' }}>
        {isGuest && filtered.length > GUEST_LIMIT
          ? `${GUEST_LIMIT}件を表示中（全${filtered.length}件）`
          : `${Math.min(visibleCount, filtered.length)}件を表示中（全${filtered.length}件）`}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--g600)', fontSize: 14 }}>
          <i className="ti ti-mood-empty" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
          投稿がまだありません
        </div>
      ) : (
        <>
          {visible.map(post => (
            <WorryCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
            />
          ))}

          {hasGuestMore && (
            <div style={{ position: 'relative' }}>
              <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {peek.map(post => (
                  <div key={post.id} style={{ filter: 'blur(5px)', opacity: 0.55 }}>
                    <WorryCard post={post} currentUserId={null} />
                  </div>
                ))}
              </div>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(249,250,251,0) 0%, rgba(249,250,251,0.75) 40%, rgba(249,250,251,1) 75%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <GuestCta remaining={filtered.length - GUEST_LIMIT} />
              </div>
            </div>
          )}

          {!isGuest && visibleCount < filtered.length && (
            <div style={{ textAlign: 'center', padding: '1rem 0 1.5rem' }}>
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                style={{
                  padding: '10px 32px', fontSize: 14, fontWeight: 600,
                  color: 'var(--pk600)', background: '#fff',
                  border: '1.5px solid var(--pk300)', borderRadius: 'var(--rmd)',
                  cursor: 'pointer',
                }}
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
