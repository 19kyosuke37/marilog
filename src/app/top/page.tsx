import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'MARILOG — 結婚のリアルを、話せる場所。',
  description: '先輩たちの結婚データ・体験談を参考にして、結婚への不安を解消しよう。既婚者も悩みを打ち明けられるコミュニティ。',
  openGraph: {
    title: 'MARILOG — 結婚のリアルを、話せる場所。',
    description: '先輩たちの結婚データ・体験談を参考にして、結婚への不安を解消しよう。',
    type: 'website',
  },
}

const SHORTCUT_TAGS = [
  { label: 'お金', tag: 'お金・家計', icon: 'ti-coin' },
  { label: 'タイミング', tag: 'タイミングがわからない', icon: 'ti-clock' },
  { label: '仕事バランス', tag: '仕事とのバランス', icon: 'ti-briefcase' },
  { label: '義実家', tag: '義実家・親族関係', icon: 'ti-home-heart' },
  { label: '子育て', tag: '子育て', icon: 'ti-baby-carriage' },
  { label: '結婚すべきか', tag: 'そもそも結婚すべきか', icon: 'ti-help-circle' },
]

function ageGroup(age: number | null) {
  if (!age) return null
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  return '40代以上'
}

export default async function TopPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [postRes, userRes] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const { data: latestPostsRaw } = await supabase
    .from('posts')
    .select('id, user_id, post_type, concern_tags, body, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  const latestPosts = latestPostsRaw ?? []

  const allUserIds = [...new Set(latestPosts.map(p => p.user_id))]

  let profilesData: { id: string; nickname: string; age: number | null; gender: string | null }[] = []
  if (allUserIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname, age, gender')
      .in('id', allUserIds)
    profilesData = data ?? []
  }

  return (
    <>
      {/* ヘッダー */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--pk600)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.6rem' }}>
          Marriage Log
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.3, marginBottom: '.6rem' }}>
          結婚の<span style={{ color: 'var(--pk400)' }}>リアル</span>を、<br />話せる場所。
        </h1>
        <div style={{ fontSize: 14, color: 'var(--g600)', margin: '0 auto 1.25rem', lineHeight: 1.9 }}>
          <p style={{ margin: 0 }}>結婚を考えている方は、先輩たちの体験・データを参考にできる。</p>
          <p style={{ margin: 0 }}>既婚者の方は、結婚生活のリアルな悩みを打ち明けられる。</p>
        </div>
        {user ? (
          <Link href="/post" style={{
            display: 'inline-block', padding: '12px 28px',
            background: 'var(--pk400)', color: '#fff',
            borderRadius: 'var(--rmd)', fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
          }}>
            悩みを投稿する →
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Link href="/auth" style={{
              display: 'inline-block', padding: '12px 28px',
              background: 'var(--pk400)', color: '#fff',
              borderRadius: 'var(--rmd)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}>
              無料で登録する →
            </Link>
            <Link href="/auth" style={{ fontSize: 12, color: 'var(--g500)', textDecoration: 'none', borderBottom: '1px solid var(--g300)' }}>
              ログインはこちら
            </Link>
          </div>
        )}
      </div>

      {/* 統計バナー */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: '1.25rem' }}>
        {[
          { num: userRes.count ?? 0, label: '登録者数', icon: 'ti-users', unit: '人' },
          { num: postRes.count ?? 0, label: '悩み投稿数', icon: 'ti-messages', unit: '件' },
        ].map(({ num, label, icon, unit }) => (
          <div key={label} style={{
            background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rmd)',
            padding: '.85rem .5rem', textAlign: 'center',
          }}>
            <i className={`ti ${icon}`} style={{ fontSize: 18, color: 'var(--pk400)', display: 'block', marginBottom: 4 }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--g800)' }}>
              {num}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--g500)' }}>{unit}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--g500)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* メインカード */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
        <Link href="/senpai" style={{
          background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rlg)',
          padding: '1.25rem 1rem', textDecoration: 'none', display: 'block',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--pk50)', color: 'var(--pk600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: '.75rem' }}>
            <i className="ti ti-database" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '.25rem', color: 'var(--g800)' }}>先輩データベース</h3>
          <p style={{ fontSize: 12, color: 'var(--g600)', lineHeight: 1.5, margin: '0 0 .75rem' }}>条件で絞って先輩を探す</p>
          <div style={{ fontSize: 12, color: 'var(--pk600)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
            検索する <i className="ti ti-arrow-right" />
          </div>
        </Link>
        <Link href="/" style={{
          background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rlg)',
          padding: '1.25rem 1rem', textDecoration: 'none', display: 'block',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--tc50)', color: 'var(--tc600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: '.75rem' }}>
            <i className="ti ti-messages" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '.25rem', color: 'var(--g800)' }}>みんなの悩み</h3>
          <p style={{ fontSize: 12, color: 'var(--g600)', lineHeight: 1.5, margin: '0 0 .75rem' }}>リアルな体験談・相談を見る</p>
          <div style={{ fontSize: 12, color: 'var(--tc600)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
            見る <i className="ti ti-arrow-right" />
          </div>
        </Link>
      </div>

      {/* カテゴリーショートカット */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: '.75rem' }}>
          <i className="ti ti-tag" style={{ marginRight: 5 }} />
          カテゴリーから探す
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SHORTCUT_TAGS.map(({ label, tag, icon }) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, padding: '7px 13px', borderRadius: 999,
                background: '#fff', border: 'var(--bd)', color: 'var(--g700)',
                textDecoration: 'none', fontWeight: 500,
              }}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 13, color: 'var(--pk400)' }} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* 最新の悩み */}
      {latestPosts.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: '.75rem' }}>
            <i className="ti ti-flame" style={{ marginRight: 5, color: 'var(--pk400)' }} />
            最新の悩み
          </div>
          {latestPosts.map(post => {
            const prof = profilesData.find(p => p.id === post.user_id)
            const age = ageGroup(prof?.age ?? null)
            return (
              <div key={post.id} style={{
                background: '#fff', border: 'var(--bd)', borderRadius: 'var(--rmd)',
                padding: '.85rem 1rem', marginBottom: 8,
              }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: '.4rem' }}>
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 999, fontWeight: 600,
                    background: post.post_type === 'married' ? 'var(--pk50)' : 'var(--tc50)',
                    color: post.post_type === 'married' ? 'var(--pk800)' : 'var(--tc800)',
                  }}>
                    {post.post_type === 'married' ? '既婚' : '結婚前'}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--g700)' }}>
                    {prof?.nickname ?? 'ユーザー'}
                    {age && <span style={{ color: 'var(--g500)', fontWeight: 400 }}>・{age}</span>}
                  </span>
                </div>
                {(post.concern_tags ?? []).length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '.35rem' }}>
                    {(post.concern_tags as string[]).slice(0, 3).map((tag: string) => (
                      <span key={tag} style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 999,
                        background: 'var(--g100)', color: 'var(--g600)', border: 'var(--bd)',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.55, margin: 0 }}>
                  {post.body.length > 75 ? post.body.slice(0, 75) + '…' : post.body}
                </p>
              </div>
            )
          })}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '11px', background: 'none', border: 'var(--bd)',
            borderRadius: 'var(--rmd)', fontSize: 13, color: 'var(--g600)',
            textDecoration: 'none', marginTop: 4,
          }}>
            みんなの悩みをもっと見る <i className="ti ti-arrow-right" />
          </Link>
        </div>
      )}
    </>
  )
}
