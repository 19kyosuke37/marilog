import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BackButton from './BackButton'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('nickname, user_type')
    .eq('id', id)
    .single()
  if (!data) return { title: 'ユーザー | MARILOG' }
  const label = data.user_type === 'married' ? '先輩（既婚）' : '結婚前ユーザー'
  return {
    title: `${data.nickname}さんのプロフィール | MARILOG`,
    description: `${data.nickname}さん（${label}）の結婚体験・データを見る。`,
    openGraph: {
      title: `${data.nickname}さんのプロフィール | MARILOG`,
      description: `${data.nickname}さん（${label}）の結婚体験・データを見る。`,
    },
  }
}

const SAT_LABELS = ['後悔している', 'やや後悔', 'ふつう', 'まあ満足', 'とても満足']
const SAT_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981']
const ANX_LABELS = ['少し不安', 'まあ不安', 'かなり不安', 'とても不安', 'もう限界']
const ANX_COLORS = ['#F09595', '#EF9F27', '#FAC775', '#9FE1CB', '#1D9E75']

type RawProfile = {
  id: string; nickname: string; age: number | null; gender: string | null
  user_type: 'married' | 'before'; trust_points: number
  anxiety_level: number | null; concern_tags: string[]
  needed_savings: number | null; ring_budget: number | null
  work_plan: string | null; kids_plan: string | null
  current_age: number | null; current_income: number | null
  current_household_income: number | null; current_savings: number | null
  current_kids_count: number | null; current_note: string | null
  updated_at: string | null
}

type RawSenpai = {
  age_at_marriage: number | null; partner_age_at_marriage: number | null
  income_at_marriage: number | null; partner_income_at_marriage: number | null
  saving_at_marriage: number | null; partner_saving_at_marriage: number | null
  area: string | null; dating_period: string | null; marriage_triggers: string[]
  satisfaction: number | null; current_status: string | null
  reflection: string | null; message_to_undecided: string | null
  engagement_ring: number | null; wedding_ring: number | null
  wedding_cost: number | null; honeymoon_cost: number | null
  has_kids: string | null; kids_count: number | null
  first_child_year: number | null; first_child_saving: number | null
}

function ageGroup(age: number | null) {
  if (!age) return null
  if (age < 30) return '20代'
  if (age < 40) return '30代'
  return '40代以上'
}

function Meter({ value, colors, labels }: { value: number; colors: string[]; labels: string[] }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} style={{
            height: 10, flex: 1, borderRadius: 3,
            background: n <= value ? colors[value - 1] : 'var(--g100)',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 12, marginTop: 3, color: value ? colors[value - 1] : 'var(--g600)' }}>
        {value ? labels[value - 1] : '未回答'}
      </div>
    </div>
  )
}

function kidsLabel(val: string | null) {
  if (val === 'yes' || val === 'いる') return 'いる'
  if (val === 'no' || val === 'いない') return 'いない'
  if (val === 'plan' || val === 'これから予定') return 'これから予定'
  return val
}

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--g100)' }}>
      <span style={{ fontSize: 12, color: 'var(--g600)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profileRaw } = await supabase
    .from('profiles')
    .select('id, nickname, age, gender, user_type, trust_points, anxiety_level, concern_tags, needed_savings, ring_budget, work_plan, kids_plan, current_age, current_income, current_household_income, current_savings, current_kids_count, updated_at')
    .eq('id', id)
    .single()

  if (!profileRaw) notFound()

  const profile = profileRaw as RawProfile

  let senpai: RawSenpai | null = null
  if (profile.user_type === 'married') {
    const { data } = await supabase
      .from('senpai_profiles')
      .select('*')
      .eq('user_id', id)
      .single()
    senpai = data as RawSenpai | null
  }

  const isMarried = profile.user_type === 'married'
  const age = ageGroup(profile.age)
  const headerParts = [isMarried ? '既婚' : '結婚前', age, profile.gender].filter(Boolean)

  const hasMoneyData = profile.needed_savings || profile.ring_budget || profile.work_plan || profile.kids_plan
  const hasCurrentData = profile.current_age || profile.current_income || profile.current_household_income || profile.current_savings || profile.current_kids_count || profile.current_note

  function formatDate(iso: string | null) {
    if (!iso) return null
    const d = new Date(iso)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  }
  const hasRingData = senpai && (senpai.engagement_ring || senpai.wedding_ring || senpai.wedding_cost || senpai.honeymoon_cost)
  const hasKids = senpai?.has_kids === 'yes' || senpai?.has_kids === 'いる'
  const hasKidsDetail = hasKids && (senpai!.kids_count || senpai!.first_child_year)

  return (
    <>
      <BackButton />

      {/* ヘッダー */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', margin: '0 auto .75rem',
          background: isMarried ? 'var(--pk50)' : 'var(--tc50)',
          border: `2px solid ${isMarried ? 'var(--pk100)' : 'var(--tc100)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
        }}>
          <i className="ti ti-user-circle" style={{ color: isMarried ? 'var(--pk400)' : 'var(--tc400)' }} />
        </div>
        {profile.updated_at && (
          <div style={{ fontSize: 10, color: 'var(--g400)', marginBottom: 6 }}>
            最終更新日：{formatDate(profile.updated_at)}
          </div>
        )}
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{profile.nickname}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, flexWrap: 'wrap' }}>
          {headerParts.map(p => (
            <span key={p} style={{
              fontSize: 11, padding: '2px 10px', borderRadius: 999,
              background: isMarried ? 'var(--pk50)' : 'var(--tc50)',
              color: isMarried ? 'var(--pk800)' : 'var(--tc800)',
            }}>
              {p}
            </span>
          ))}
          <span style={{
            fontSize: 11, padding: '2px 10px', borderRadius: 999,
            background: 'var(--am50)', color: 'var(--am600)',
          }}>
            {profile.trust_points}pt
          </span>
        </div>
      </div>

      {/* ── 既婚ユーザー ── */}
      {isMarried && senpai && (
        <>
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pk800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-rings" /> 結婚当時の状況
            </div>
            {/* 2カラム比較テーブル */}
            <div style={{ marginBottom: '.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid var(--g100)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ background: 'var(--g50)', padding: '6px 10px', fontSize: 11, color: 'var(--g500)', fontWeight: 600, borderBottom: '1px solid var(--g100)' }} />
                <div style={{ background: 'var(--pk50)', padding: '6px 10px', fontSize: 12, color: 'var(--pk700)', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid var(--g100)', borderLeft: '1px solid var(--g100)' }}>あなた</div>
                <div style={{ background: 'var(--tc50)', padding: '6px 10px', fontSize: 12, color: 'var(--tc700)', fontWeight: 600, textAlign: 'center', borderBottom: '1px solid var(--g100)', borderLeft: '1px solid var(--g100)' }}>相手</div>
                <div style={{ padding: '7px 10px', fontSize: 11, color: 'var(--g500)', background: 'var(--g50)', display: 'flex', alignItems: 'center' }}>年齢</div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.age_at_marriage ? `${senpai.age_at_marriage}歳` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.partner_age_at_marriage ? `${senpai.partner_age_at_marriage}歳` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
                <div style={{ padding: '7px 10px', fontSize: 11, color: 'var(--g500)', background: 'var(--g50)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center' }}>年収</div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.income_at_marriage ? `${senpai.income_at_marriage}万` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.partner_income_at_marriage ? `${senpai.partner_income_at_marriage}万` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
                <div style={{ padding: '7px 10px', fontSize: 11, color: 'var(--g500)', background: 'var(--g50)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center' }}>貯金</div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.saving_at_marriage ? `${senpai.saving_at_marriage}万` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
                <div style={{ padding: '7px 10px', fontSize: 13, fontWeight: 500, textAlign: 'center', borderLeft: '1px solid var(--g100)', borderTop: '1px solid var(--g100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {senpai.partner_saving_at_marriage ? `${senpai.partner_saving_at_marriage}万` : <span style={{ color: 'var(--g300)' }}>—</span>}
                </div>
              </div>
            </div>
            <Row label="居住エリア" value={senpai.area} />
            <Row label="交際期間" value={senpai.dating_period} />

            {senpai.marriage_triggers?.length > 0 && (
              <div style={{ padding: '.5rem 0', borderBottom: '1px solid var(--g100)' }}>
                <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 5 }}>結婚の決め手</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {senpai.marriage_triggers.map(t => (
                    <span key={t} style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 999,
                      background: 'var(--pk50)', color: 'var(--pk800)', border: '1px solid var(--pk100)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pk800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-heart" /> 結婚について
            </div>
            {senpai.satisfaction && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 6 }}>満足度</div>
                <Meter value={senpai.satisfaction} colors={SAT_COLORS} labels={SAT_LABELS} />
              </div>
            )}
            <Row label="現在の状況" value={senpai.current_status} />
            {senpai.reflection && (
              <div style={{ padding: '.65rem 0', borderBottom: '1px solid var(--g100)' }}>
                <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 4 }}>よかったこと・後悔していること</div>
                <div style={{ fontSize: 13, lineHeight: 1.65 }}>{senpai.reflection}</div>
              </div>
            )}
            {senpai.message_to_undecided && (
              <div style={{ padding: '.65rem 0' }}>
                <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 4 }}>迷っている人へひと言</div>
                <div style={{
                  fontSize: 13, lineHeight: 1.65,
                  background: 'var(--pk50)', borderRadius: 'var(--rsm)',
                  padding: '.65rem .85rem', fontStyle: 'italic',
                }}>
                  「{senpai.message_to_undecided}」
                </div>
              </div>
            )}
          </div>

          {hasRingData && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-diamond" style={{ color: 'var(--pk400)' }} /> 指輪・式のこと
              </div>
              <Row label="婚約指輪" value={senpai!.engagement_ring ? `${senpai!.engagement_ring}万円` : null} />
              <Row label="結婚指輪（2人分）" value={senpai!.wedding_ring ? `${senpai!.wedding_ring}万円` : null} />
              <Row label="結婚式" value={senpai!.wedding_cost ? `${senpai!.wedding_cost}万円` : null} />
              <Row label="新婚旅行" value={senpai!.honeymoon_cost ? `${senpai!.honeymoon_cost}万円` : null} />
            </div>
          )}

          {senpai.has_kids && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-baby-carriage" style={{ color: 'var(--tc400)' }} /> 子どものこと
              </div>
              <Row label="子どもの有無" value={kidsLabel(senpai.has_kids)} />
              {hasKidsDetail && (
                <>
                  <Row label="人数" value={senpai.kids_count ? `${senpai.kids_count}人` : null} />
                  <Row label="第一子：結婚何年目" value={senpai.first_child_year ? `${senpai.first_child_year}年目` : null} />
                  <Row label="第一子時の貯金" value={senpai.first_child_saving ? `${senpai.first_child_saving}万円` : null} />
                </>
              )}
            </div>
          )}
        </>
      )}

      {isMarried && hasCurrentData && (
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="ti ti-calendar-stats" style={{ color: 'var(--am600)' }} /> 現在の状況
          </div>
          {(profile.current_age || senpai?.age_at_marriage) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--g100)' }}>
              <span style={{ fontSize: 12, color: 'var(--g600)' }}>年齢</span>
              <span style={{ fontSize: 13 }}>
                {senpai?.age_at_marriage ? `${senpai.age_at_marriage}歳` : '—'}
                <span style={{ color: 'var(--g400)', margin: '0 6px' }}>→</span>
                <strong>{profile.current_age ? `${profile.current_age}歳` : '—'}</strong>
              </span>
            </div>
          )}
          {(profile.current_income || senpai?.income_at_marriage) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--g100)' }}>
              <span style={{ fontSize: 12, color: 'var(--g600)' }}>年収</span>
              <span style={{ fontSize: 13 }}>
                {senpai?.income_at_marriage ? `${senpai.income_at_marriage}万` : '—'}
                <span style={{ color: 'var(--g400)', margin: '0 6px' }}>→</span>
                <strong>{profile.current_income ? `${profile.current_income}万` : '—'}</strong>
              </span>
            </div>
          )}
          {profile.current_household_income && (
            <Row label="世帯年収（現在）" value={`${profile.current_household_income}万円`} />
          )}
          {(profile.current_savings || senpai?.saving_at_marriage) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--g100)' }}>
              <span style={{ fontSize: 12, color: 'var(--g600)' }}>貯金</span>
              <span style={{ fontSize: 13 }}>
                {senpai?.saving_at_marriage ? `${senpai.saving_at_marriage}万` : '—'}
                <span style={{ color: 'var(--g400)', margin: '0 6px' }}>→</span>
                <strong>{profile.current_savings ? `${profile.current_savings}万` : '—'}</strong>
              </span>
            </div>
          )}
          {profile.current_kids_count != null && (
            <Row label="子どもの人数（現在）" value={`${profile.current_kids_count}人`} />
          )}
          {profile.current_note && (
            <div style={{ padding: '.65rem 0' }}>
              <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 4 }}>現在の生活について</div>
              <div style={{ fontSize: 13, lineHeight: 1.65 }}>{profile.current_note}</div>
            </div>
          )}
        </div>
      )}

      {isMarried && !senpai && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--g600)', fontSize: 13 }}>
          先輩DBへの登録はまだありません
        </div>
      )}

      {/* ── 結婚前ユーザー ── */}
      {!isMarried && (
        <>
          {(profile.anxiety_level || (profile.concern_tags?.length ?? 0) > 0) && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tc800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-heart-broken" /> 今の悩み・不安
              </div>
              {profile.anxiety_level && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 6 }}>結婚への不安度</div>
                  <Meter value={profile.anxiety_level} colors={ANX_COLORS} labels={ANX_LABELS} />
                </div>
              )}
              {profile.concern_tags?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 5 }}>悩んでいること</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {profile.concern_tags.map(t => (
                      <span key={t} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 999,
                        background: 'var(--tc50)', color: 'var(--tc800)', border: '1px solid var(--tc100)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasMoneyData && (
            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-coin" style={{ color: 'var(--am600)' }} /> お金・将来のイメージ
              </div>
              <Row label="必要だと思う貯金額" value={profile.needed_savings ? `${profile.needed_savings}万円` : null} />
              <Row label="指輪の予算イメージ" value={profile.ring_budget ? `${profile.ring_budget}万円` : null} />
              <Row label="結婚後の働き方イメージ" value={profile.work_plan} />
              <Row label="子どもについて" value={profile.kids_plan} />
            </div>
          )}

          {!profile.anxiety_level && !profile.concern_tags?.length && !hasMoneyData && (
            <div className="card" style={{ textAlign: 'center', color: 'var(--g600)', fontSize: 13 }}>
              プロフィール詳細はまだ入力されていません
            </div>
          )}
        </>
      )}
    </>
  )
}
