'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const SAT_LABELS = ['後悔', 'やや後悔', 'ふつう', 'まあ満足', 'とても満足']
const SAT_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981']

export type SenpaiItem = {
  user_id: string
  nickname: string
  age: number | null
  gender: string | null
  age_at_marriage: number | null
  partner_age_at_marriage: number | null
  income_at_marriage: number | null
  saving_at_marriage: number | null
  area: string | null
  dating_period: string | null
  marriage_triggers: string[]
  satisfaction: number | null
  current_status: string | null
  message_to_undecided: string | null
}

const AREAS = ['すべて', '首都圏（東京・神奈川・埼玉・千葉）', '関西圏（大阪・京都・兵庫）', '東海（愛知・静岡・岐阜）', 'その他']
const STATUSES = ['すべて', '結婚継続中', '離婚した', '別居中']

const GUEST_LIMIT = 10
const PAGE_SIZE = 10

function ageGroup(age: number | null) {
  if (!age) return null
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  return '40代以上'
}

function GuestCta({ remaining: _ }: { remaining: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ fontSize: 28, color: 'var(--g400)', marginBottom: '.5rem' }}>
        <i className="ti ti-lock" />
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: '.35rem' }}>
        さらに先輩を見るには登録が必要です
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

export default function SenpaiPage({ items, isLoggedIn }: { items: SenpaiItem[]; isLoggedIn: boolean }) {
  const [areaFilter, setAreaFilter] = useState('すべて')
  const [satFilter, setSatFilter] = useState(-1)
  const [statusFilter, setStatusFilter] = useState('すべて')
  const [ageFilter, setAgeFilter] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [areaFilter, satFilter, statusFilter, ageFilter, searchQuery])

  const q = searchQuery.trim().toLowerCase()
  const filtered = items.filter(s => {
    if (areaFilter !== 'すべて' && s.area !== areaFilter) return false
    if (satFilter > 0 && s.satisfaction !== satFilter) return false
    if (statusFilter !== 'すべて' && s.current_status !== statusFilter) return false
    if (ageFilter > 0) {
      const a = s.age_at_marriage
      if (!a) return false
      if (ageFilter === 50 ? a < 50 : (a < ageFilter || a >= ageFilter + 10)) return false
    }
    if (q) {
      const searchable = [s.nickname, s.message_to_undecided, ...(s.marriage_triggers ?? [])].filter(Boolean).join(' ').toLowerCase()
      if (!searchable.includes(q)) return false
    }
    return true
  })

  const isGuest = !isLoggedIn
  const visible = isGuest ? filtered.slice(0, GUEST_LIMIT) : filtered.slice(0, visibleCount)
  const peek = isGuest ? filtered.slice(GUEST_LIMIT, GUEST_LIMIT + 2) : []
  const hasGuestMore = isGuest && filtered.length > GUEST_LIMIT

  function SenpaiCard({ s }: { s: SenpaiItem }) {
    const sat = s.satisfaction ?? 0
    const tags = [s.area, s.dating_period].filter(Boolean)
    const ageParts = [ageGroup(s.age), s.gender].filter(Boolean)
    return (
      <div style={{
        background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rlg)',
        padding: '1rem 1.1rem', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.6rem' }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{s.nickname}</span>
            {ageParts.length > 0 && (
              <span style={{ fontSize: 12, color: 'var(--g600)', marginLeft: 6 }}>
                {ageParts.join('・')}
              </span>
            )}
          </div>
          {s.current_status && (
            <span style={{
              fontSize: 11, padding: '2px 9px', borderRadius: 999,
              background: s.current_status === '結婚継続中' ? 'var(--tc50)' : 'var(--g100)',
              color: s.current_status === '結婚継続中' ? 'var(--tc800)' : 'var(--g600)',
            }}>
              {s.current_status}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '.6rem' }}>
          {s.age_at_marriage && (
            <span style={{ fontSize: 12, color: 'var(--g700)' }}>
              結婚時 <strong>{s.age_at_marriage}歳</strong>
              {s.partner_age_at_marriage && `・相手${s.partner_age_at_marriage}歳`}
            </span>
          )}
          {s.income_at_marriage && (
            <span style={{ fontSize: 12, color: 'var(--g700)' }}>
              年収 <strong>{s.income_at_marriage}万</strong>
            </span>
          )}
          {s.saving_at_marriage && (
            <span style={{ fontSize: 12, color: 'var(--g700)' }}>
              貯金 <strong>{s.saving_at_marriage}万</strong>
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '.6rem' }}>
            {tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: 'var(--g100)', color: 'var(--g600)', border: 'var(--bd)',
              }}>{t}</span>
            ))}
          </div>
        )}

        {s.marriage_triggers?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '.6rem' }}>
            {s.marriage_triggers.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: 'var(--pk50)', color: 'var(--pk800)', border: '1px solid var(--pk100)',
              }}>{t}</span>
            ))}
          </div>
        )}

        {sat > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '.6rem' }}>
            <span style={{ fontSize: 11, color: SAT_COLORS[sat - 1], minWidth: 60 }}>
              {SAT_LABELS[sat - 1]}
            </span>
            <div style={{ flex: 1, height: 5, background: 'var(--g100)', borderRadius: 3 }}>
              <div style={{
                height: 5, borderRadius: 3,
                width: `${(sat / 5) * 100}%`,
                background: SAT_COLORS[sat - 1],
              }} />
            </div>
          </div>
        )}

        {s.message_to_undecided && (
          <div style={{
            fontSize: 12, color: 'var(--g700)', lineHeight: 1.6,
            background: 'var(--pk50)', borderRadius: 'var(--rsm)',
            padding: '.5rem .75rem', marginBottom: '.6rem', fontStyle: 'italic',
          }}>
            「{s.message_to_undecided}」
          </div>
        )}

        {isLoggedIn ? (
          <Link href={`/user/${s.user_id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, color: 'var(--pk600)', textDecoration: 'none',
            fontWeight: 600,
          }}>
            詳しく見る <i className="ti ti-arrow-right" style={{ fontSize: 11 }} />
          </Link>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: 'var(--g400)', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0, fontWeight: 600,
            }}
          >
            <i className="ti ti-lock" style={{ fontSize: 11 }} /> 詳しく見る（要登録）
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="section-title">先輩データベース</div>
      <div className="section-sub">条件で絞り込んで、似た先輩を探す</div>

      {/* 検索 */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--g400)', fontSize: 14 }} />
        <input
          type="text"
          placeholder="ニックネーム・メッセージ・きっかけで検索..."
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

      {/* フィルター */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--g600)', minWidth: 52 }}>エリア</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {AREAS.map(a => (
              <button key={a} onClick={() => setAreaFilter(a)} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid',
                borderColor: areaFilter === a ? 'var(--pk400)' : 'var(--g200)',
                background: areaFilter === a ? 'var(--pk50)' : '#fff',
                color: areaFilter === a ? 'var(--pk800)' : 'var(--g600)',
                fontWeight: areaFilter === a ? 600 : 400,
              }}>
                {a === 'すべて' ? '全エリア' : a.split('（')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--g600)', minWidth: 52 }}>満足度</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {[['すべて', -1], ['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5]].map(([label, val]) => (
              <button key={String(val)} onClick={() => setSatFilter(Number(val))} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid',
                borderColor: satFilter === Number(val) ? 'var(--pk400)' : 'var(--g200)',
                background: satFilter === Number(val) ? 'var(--pk50)' : '#fff',
                color: satFilter === Number(val) ? 'var(--pk800)' : 'var(--g600)',
                fontWeight: satFilter === Number(val) ? 600 : 400,
              }}>
                {String(label)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--g600)', minWidth: 52 }}>結婚年齢</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {([['すべて', -1], ['10代', 10], ['20代', 20], ['30代', 30], ['40代', 40], ['50代以上', 50]] as [string, number][]).map(([label, val]) => (
              <button key={val} onClick={() => setAgeFilter(val)} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid',
                borderColor: ageFilter === val ? 'var(--pk400)' : 'var(--g200)',
                background: ageFilter === val ? 'var(--pk50)' : '#fff',
                color: ageFilter === val ? 'var(--pk800)' : 'var(--g600)',
                fontWeight: ageFilter === val ? 600 : 400,
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--g600)', minWidth: 52 }}>状況</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid',
                borderColor: statusFilter === s ? 'var(--pk400)' : 'var(--g200)',
                background: statusFilter === s ? 'var(--pk50)' : '#fff',
                color: statusFilter === s ? 'var(--pk800)' : 'var(--g600)',
                fontWeight: statusFilter === s ? 600 : 400,
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: '.75rem' }}>
        {isGuest && filtered.length > GUEST_LIMIT
          ? `${GUEST_LIMIT}人を表示中（全${filtered.length}人）`
          : `${Math.min(visibleCount, filtered.length)}人を表示中（全${filtered.length}人）`}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--g600)', fontSize: 13 }}>
          <i className="ti ti-search" style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
          条件に合う先輩が見つかりませんでした
        </div>
      ) : (
        <>
          {visible.map(s => <SenpaiCard key={s.user_id} s={s} />)}

          {hasGuestMore && (
            <div style={{ position: 'relative' }}>
              <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {peek.map(s => (
                  <div key={s.user_id} style={{ filter: 'blur(5px)', opacity: 0.55 }}>
                    <SenpaiCard s={s} />
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
                もっと見る（残り{filtered.length - visibleCount}人）
              </button>
            </div>
          )}
        </>
      )}

      {/* ログイン促進モーダル（詳しく見るクリック時） */}
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
              <i className="ti ti-database-search" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: '.4rem' }}>
              先輩の詳細を見るには登録が必要です
            </h3>
            <p style={{ fontSize: 13, color: 'var(--g600)', marginBottom: '1.1rem', lineHeight: 1.6 }}>
              無料登録で先輩の詳細データ・<br />アドバイスをすべて閲覧できます。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/auth" style={{
                padding: 11, background: 'var(--pk400)', color: '#fff',
                border: 'none', borderRadius: 'var(--rmd)', fontSize: 14,
                fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'block',
              }}>
                無料で登録して詳細を見る →
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
