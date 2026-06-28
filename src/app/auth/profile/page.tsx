'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Gender = '男性' | '女性' | 'その他'
type UserType = 'married' | 'before'

const AREA_OPTIONS = ['首都圏（東京・神奈川・埼玉・千葉）', '関西圏（大阪・京都・兵庫）', '東海（愛知・静岡・岐阜）', 'その他']
const PERIOD_OPTIONS = ['半年未満', '半年〜1年', '1〜2年', '2〜3年', '3〜5年', '5年以上']
const STATUS_OPTIONS = ['結婚継続中', '離婚した', '別居中']
const TRIGGER_TAGS = ['年齢的なタイミング', '相手への安心感', '子どもが欲しい', '経済的な安定', '周りの影響', '勢いで', 'その他']
const SATISFACTION_LABELS = ['後悔している', 'やや後悔', 'ふつう', 'まあ満足', 'とても満足']
const SATISFACTION_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981']
const WORK_OPTIONS = ['ふたりとも正社員継続', '自分が時短・パートに', '相手に養ってもらいたい', 'まだ決めていない']
const KIDS_OPTIONS = ['ほしい', 'ほしくない', 'まだわからない', '相手と意見が合っていない']
const KIDS_STATUS_OPTIONS = ['いる', 'いない', 'これから予定']
const KIDS_TO_DB: Record<string, string> = { 'いる': 'yes', 'いない': 'no', 'これから予定': 'plan' }
const KIDS_FROM_DB: Record<string, string> = { 'yes': 'いる', 'no': 'いない', 'plan': 'これから予定' }
const CONCERN_TAGS = ['お金・貯金が不安', 'タイミングがわからない', '相手との温度差', 'そもそも結婚すべきか', '子どものこと', '住む場所', '仕事とのバランス', '親への紹介・挨拶', '相手の収入が不安', '自分の気持ちが揺れている', '性の不一致・相性が不安', 'その他']
const ANXIETY_LABELS = ['少し不安', 'まあ不安', 'かなり不安', 'とても不安', 'もう限界']
const ANXIETY_COLORS = ['#F09595', '#EF9F27', '#FAC775', '#9FE1CB', '#1D9E75']

const REQ = <span style={{ color: 'var(--pk400)', marginLeft: 2 }}>*</span>
const OPT = <span style={{ fontSize: 11, color: 'var(--g500)', marginLeft: 5, fontWeight: 400 }}>任意</span>

export default function ProfileSetupPage() {
  const router = useRouter()
  const supabase = createClient()

  // Basic
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [age, setAge] = useState('')
  const [userType, setUserType] = useState<UserType | ''>('')

  // Married fields
  const [ageAtMarriage, setAgeAtMarriage] = useState('')
  const [partnerAge, setPartnerAge] = useState('')
  const [income, setIncome] = useState('')
  const [partnerIncome, setPartnerIncome] = useState('')
  const [saving, setSaving] = useState('')
  const [partnerSaving, setPartnerSaving] = useState('')
  const [area, setArea] = useState('')
  const [period, setPeriod] = useState('')
  const [cohabitation, setCohabitation] = useState<'' | 'yes' | 'no'>('')
  const [cohabitationPeriod, setCohabitationPeriod] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [triggerOther, setTriggerOther] = useState('')
  const [satisfaction, setSatisfaction] = useState(0)
  const [status, setStatus] = useState('')
  const [reflection, setReflection] = useState('')
  const [message, setMessage] = useState('')
  // Married optional
  const [engagementRing, setEngagementRing] = useState('')
  const [weddingRing, setWeddingRing] = useState('')
  const [hadWedding, setHadWedding] = useState<'' | 'yes' | 'no'>('')
  const [weddingCost, setWeddingCost] = useState('')
  const [hadHoneymoon, setHadHoneymoon] = useState<'' | 'yes' | 'no'>('')
  const [honeymoon, setHoneymoon] = useState('')
  const [ceremonyNote, setCeremonyNote] = useState('')
  const [hasKids, setHasKids] = useState('')
  const [kidsCount, setKidsCount] = useState('')
  const [firstChildYear, setFirstChildYear] = useState('')
  // Married current situation
  const [currentAge, setCurrentAge] = useState('')
  const [currentIncome, setCurrentIncome] = useState('')
  const [currentHouseholdIncome, setCurrentHouseholdIncome] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [currentKidsCount, setCurrentKidsCount] = useState('')
  const [currentNote, setCurrentNote] = useState('')
  const [firstChildSaving, setFirstChildSaving] = useState('')

  // Before-marriage fields
  const [anxietyLevel, setAnxietyLevel] = useState(0)
  const [concernTags, setConcernTags] = useState<string[]>([])
  const [concernOther, setConcernOther] = useState('')
  const [worryNote, setWorryNote] = useState('')
  const [neededSavings, setNeededSavings] = useState('')
  const [ringBudget, setRingBudget] = useState('')
  const [workPlan, setWorkPlan] = useState('')
  const [kidsPlan, setKidsPlan] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!p) return
      const prof = p as Record<string, unknown>
      setIsEdit(true)
      setExistingAvatarUrl((prof.avatar_url as string) ?? null)
      setNickname((prof.nickname as string) ?? '')
      setGender((prof.gender as Gender) ?? '')
      setAge(prof.age != null ? String(prof.age) : '')
      setUserType((prof.user_type as UserType) ?? '')
      setAnxietyLevel((prof.anxiety_level as number) ?? 0)
      setConcernTags((prof.concern_tags as string[]) ?? [])
      setWorryNote((prof.worry_note as string) ?? '')
      setNeededSavings(prof.needed_savings != null ? String(prof.needed_savings) : '')
      setRingBudget(prof.ring_budget != null ? String(prof.ring_budget) : '')
      setWorkPlan((prof.work_plan as string) ?? '')
      setKidsPlan((prof.kids_plan as string) ?? '')

      if (prof.user_type === 'married') {
        const { data: s } = await supabase.from('senpai_profiles').select('*').eq('user_id', user.id).single()
        if (!s) return
        const sp = s as Record<string, unknown>
        setAgeAtMarriage(sp.age_at_marriage != null ? String(sp.age_at_marriage) : '')
        setPartnerAge(sp.partner_age_at_marriage != null ? String(sp.partner_age_at_marriage) : '')
        setIncome(sp.income_at_marriage != null ? String(sp.income_at_marriage) : '')
        setPartnerIncome(sp.partner_income_at_marriage != null ? String(sp.partner_income_at_marriage) : '')
        setSaving(sp.saving_at_marriage != null ? String(sp.saving_at_marriage) : '')
        setPartnerSaving(sp.partner_saving_at_marriage != null ? String(sp.partner_saving_at_marriage) : '')
        setArea((sp.area as string) ?? '')
        setPeriod((sp.dating_period as string) ?? '')
        setCohabitation((sp.cohabitation as '' | 'yes' | 'no') ?? '')
        setCohabitationPeriod((sp.cohabitation_period as string) ?? '')
        setTriggers((sp.marriage_triggers as string[]) ?? [])
        setSatisfaction((sp.satisfaction as number) ?? 0)
        setStatus((sp.current_status as string) ?? '')
        setReflection((sp.reflection as string) ?? '')
        setMessage((sp.message_to_undecided as string) ?? '')
        setEngagementRing(sp.engagement_ring != null ? String(sp.engagement_ring) : '')
        setWeddingRing(sp.wedding_ring != null ? String(sp.wedding_ring) : '')
        setHadWedding(sp.wedding_cost != null ? 'yes' : '')
        setWeddingCost(sp.wedding_cost != null ? String(sp.wedding_cost) : '')
        setHadHoneymoon(sp.honeymoon_cost != null ? 'yes' : '')
        setHoneymoon(sp.honeymoon_cost != null ? String(sp.honeymoon_cost) : '')
        setCeremonyNote((sp.ceremony_note as string) ?? '')
        setHasKids(KIDS_FROM_DB[sp.has_kids as string] ?? (sp.has_kids as string) ?? '')
        setKidsCount(sp.kids_count != null ? String(sp.kids_count) : '')
        setFirstChildYear(sp.first_child_year != null ? String(sp.first_child_year) : '')
        setFirstChildSaving(sp.first_child_saving != null ? String(sp.first_child_saving) : '')
        setCurrentAge(prof.current_age != null ? String(prof.current_age) : '')
        setCurrentIncome(prof.current_income != null ? String(prof.current_income) : '')
        setCurrentHouseholdIncome(prof.current_household_income != null ? String(prof.current_household_income) : '')
        setCurrentSavings(prof.current_savings != null ? String(prof.current_savings) : '')
        setCurrentKidsCount(prof.current_kids_count != null ? String(prof.current_kids_count) : '')
        setCurrentNote((prof.current_note as string) ?? '')
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleTrigger(tag: string) {
    setTriggers(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    if (tag === 'その他') setTriggerOther('')
  }

  function toggleConcernTag(tag: string) {
    setConcernTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    if (tag === 'その他') setConcernOther('')
  }

  function buildConcernTags() {
    if (!concernTags.includes('その他') || !concernOther.trim()) return concernTags
    return concernTags.map(t => t === 'その他' ? `その他（${concernOther.trim()}）` : t)
  }

  function buildTriggerTags() {
    if (!triggers.includes('その他') || !triggerOther.trim()) return triggers
    return triggers.map(t => t === 'その他' ? `その他（${triggerOther.trim()}）` : t)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) { setError('ニックネームを入力してください'); return }
    if (!gender) { setError('性別を選択してください'); return }
    if (!age) { setError('年齢を入力してください'); return }
    if (!userType) { setError('あなたの状況を選択してください'); return }
    if (userType === 'before') {
      if (!anxietyLevel) { setError('結婚への不安度を選択してください'); return }
      if (concernTags.length === 0) { setError('悩んでいることを1つ以上選択してください'); return }
      if (!neededSavings) { setError('必要だと思う貯金額を入力してください'); return }
      if (!ringBudget) { setError('指輪の予算イメージを入力してください'); return }
      if (!workPlan) { setError('結婚後の働き方イメージを選択してください'); return }
      if (!kidsPlan) { setError('子どもについて選択してください'); return }
    }
    if (userType === 'married') {
      if (!ageAtMarriage) { setError('結婚当時のあなたの年齢を入力してください'); return }
      if (!partnerAge) { setError('結婚当時の相手の年齢を入力してください'); return }
      if (!income) { setError('結婚当時のあなたの年収を入力してください'); return }
      if (!saving) { setError('結婚当時のあなたの貯金を入力してください'); return }
      if (!area) { setError('居住エリアを選択してください'); return }
      if (!period) { setError('交際期間を選択してください'); return }
      if (!cohabitation) { setError('結婚前の同棲について選択してください'); return }
      if (cohabitation === 'yes' && !cohabitationPeriod) { setError('同棲期間を選択してください'); return }
      if (triggers.length === 0) { setError('結婚の決め手を1つ以上選択してください'); return }
      if (!status) { setError('現在の状況を選択してください'); return }
      if (!hasKids) { setError('子どもの有無を選択してください'); return }
      if (hasKids === 'いる') {
        if (!kidsCount) { setError('子どもの人数を入力してください'); return }
        if (!firstChildYear) { setError('第一子の出産時期を入力してください'); return }
        if (!firstChildSaving) { setError('第一子時の貯金を入力してください'); return }
      }
    }
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      let avatarUrl = existingAvatarUrl
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/avatar.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatarUrl = urlData.publicUrl
      }

      const profileData: Record<string, unknown> = {
        id: user.id,
        nickname: nickname.trim(),
        gender: gender || null,
        age: parseInt(age),
        user_type: userType,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      }

      if (userType === 'married') {
        profileData.current_age = currentAge ? parseInt(currentAge) : null
        profileData.current_income = currentIncome ? parseInt(currentIncome) : null
        profileData.current_household_income = currentHouseholdIncome ? parseInt(currentHouseholdIncome) : null
        profileData.current_savings = currentSavings ? parseInt(currentSavings) : null
        profileData.current_kids_count = currentKidsCount ? parseInt(currentKidsCount) : null
        profileData.current_note = currentNote.trim() || null
      }

      if (userType === 'before') {
        profileData.anxiety_level = anxietyLevel || null
        profileData.concern_tags = buildConcernTags()
        profileData.worry_note = worryNote.trim() || null
        profileData.needed_savings = neededSavings ? parseInt(neededSavings) : null
        profileData.ring_budget = ringBudget ? parseInt(ringBudget) : null
        profileData.work_plan = workPlan || null
        profileData.kids_plan = kidsPlan || null
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData as never)
      if (profileError) throw profileError

      if (userType === 'married') {
        const senpaiData: Record<string, unknown> = {
          user_id: user.id,
          age_at_marriage: parseInt(ageAtMarriage),
          partner_age_at_marriage: partnerAge ? parseInt(partnerAge) : null,
          income_at_marriage: income ? parseInt(income) : null,
          partner_income_at_marriage: partnerIncome ? parseInt(partnerIncome) : null,
          saving_at_marriage: saving ? parseInt(saving) : null,
          partner_saving_at_marriage: partnerSaving ? parseInt(partnerSaving) : null,
          area: area || null,
          dating_period: period || null,
          cohabitation: cohabitation || null,
          cohabitation_period: cohabitation === 'yes' ? (cohabitationPeriod || null) : null,
          marriage_triggers: buildTriggerTags(),
          satisfaction,
          current_status: status,
          reflection: reflection.trim() || null,
          message_to_undecided: message.trim() || null,
          engagement_ring: engagementRing ? parseInt(engagementRing) : null,
          wedding_ring: weddingRing ? parseInt(weddingRing) : null,
          wedding_cost: hadWedding === 'yes' && weddingCost ? parseInt(weddingCost) : null,
          honeymoon_cost: hadHoneymoon === 'yes' && honeymoon ? parseInt(honeymoon) : null,
          ceremony_note: ceremonyNote.trim() || null,
          has_kids: hasKids ? (KIDS_TO_DB[hasKids] ?? hasKids) : null,
          kids_count: kidsCount ? parseInt(kidsCount) : null,
          first_child_year: firstChildYear ? parseInt(firstChildYear) : null,
          first_child_saving: firstChildSaving ? parseInt(firstChildSaving) : null,
        }
        const { error: senpaiError } = await supabase
          .from('senpai_profiles')
          .upsert(senpaiData as never, { onConflict: 'user_id' })
        if (senpaiError) throw senpaiError
      }

      router.push(isEdit ? '/mypage' : '/')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'message' in err)
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err)
      setError(msg || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const genders: Gender[] = ['男性', '女性', 'その他']

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <label style={{ cursor: 'pointer', display: 'inline-block' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
            background: 'var(--pk50)', border: '2px solid var(--pk100)',
            margin: '0 auto .5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {(avatarPreview || existingAvatarUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview ?? existingAvatarUrl ?? ''} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="ti ti-user-circle" style={{ fontSize: 40, color: 'var(--pk400)' }} />
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--pk600)', fontWeight: 600 }}>
            <i className="ti ti-camera" style={{ marginRight: 4 }} />
            {existingAvatarUrl ? '写真を変更' : '写真を設定'}
          </span>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              setAvatarFile(file)
              setAvatarPreview(URL.createObjectURL(file))
            }}
          />
        </label>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '.3rem', marginTop: '.75rem' }}>
          {isEdit ? 'プロフィール編集' : 'プロフィール設定'}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--g600)' }}>あなたの状況を教えてください</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── 基本情報 ── */}
        <div className="card">
          <div className="field">
            <label>ニックネーム{REQ}</label>
            <input
              type="text"
              placeholder="例：まりこ、たろう28歳など"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="field">
            <label>性別{REQ}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {genders.map(g => (
                <button key={g} type="button" onClick={() => setGender(g)} style={{
                  flex: 1, padding: '9px 4px', border: 'var(--bd)',
                  borderRadius: 'var(--rsm)', fontSize: 13, cursor: 'pointer',
                  background: gender === g ? 'var(--pk50)' : '#fff',
                  borderColor: gender === g ? 'var(--pk100)' : '#E8E6E0',
                  color: gender === g ? 'var(--pk800)' : 'var(--g600)',
                  fontWeight: gender === g ? 600 : 400,
                }}>
                  {g === '男性' ? '♂ 男性' : g === '女性' ? '♀ 女性' : 'その他'}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>年齢{REQ}</label>
            <input
              type="number"
              placeholder="例：28"
              value={age}
              onChange={e => setAge(e.target.value)}
              min={18}
              max={80}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>あなたの状況{REQ}</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
              <button type="button" onClick={() => setUserType('married')} style={{
                flex: 1, padding: '12px 8px', border: '2px solid',
                borderRadius: 'var(--rsm)', fontSize: 14, cursor: 'pointer',
                background: userType === 'married' ? 'var(--pk50)' : '#fff',
                borderColor: userType === 'married' ? 'var(--pk400)' : '#E8E6E0',
                color: userType === 'married' ? 'var(--pk800)' : 'var(--g600)',
                fontWeight: userType === 'married' ? 600 : 400,
              }}>
                💍 既婚
              </button>
              <button type="button" onClick={() => setUserType('before')} style={{
                flex: 1, padding: '12px 8px', border: '2px solid',
                borderRadius: 'var(--rsm)', fontSize: 14, cursor: 'pointer',
                background: userType === 'before' ? 'var(--tc50)' : '#fff',
                borderColor: userType === 'before' ? 'var(--tc400)' : '#E8E6E0',
                color: userType === 'before' ? 'var(--tc800)' : 'var(--g600)',
                fontWeight: userType === 'before' ? 600 : 400,
              }}>
                💭 結婚前
              </button>
            </div>
          </div>
        </div>

        {/* ── 既婚 詳細フォーム ── */}
        {userType === 'married' && (
          <>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--pk50)', color: 'var(--pk400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                  <i className="ti ti-rings" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>結婚当時の状況</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>あなたの年齢{REQ}</label>
                  <input type="number" placeholder="例：28" value={ageAtMarriage}
                    onChange={e => setAgeAtMarriage(e.target.value)} />
                </div>
                <div className="field">
                  <label>相手の年齢{REQ}</label>
                  <input type="number" placeholder="例：30" value={partnerAge}
                    onChange={e => setPartnerAge(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>あなたの年収（万円）{REQ}</label>
                  <input type="number" placeholder="例：400" value={income}
                    onChange={e => setIncome(e.target.value)} />
                </div>
                <div className="field">
                  <label>相手の年収（万円）{OPT}</label>
                  <input type="number" placeholder="例：350" value={partnerIncome}
                    onChange={e => setPartnerIncome(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>あなたの貯金（万円）{REQ}</label>
                  <input type="number" placeholder="例：150" value={saving}
                    onChange={e => setSaving(e.target.value)} />
                </div>
                <div className="field">
                  <label>相手の貯金（万円）{OPT}</label>
                  <input type="number" placeholder="例：100" value={partnerSaving}
                    onChange={e => setPartnerSaving(e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>居住エリア{REQ}</label>
                <select value={area} onChange={e => setArea(e.target.value)}>
                  <option value="">選択してください</option>
                  {AREA_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>交際期間{REQ}</label>
                <select value={period} onChange={e => setPeriod(e.target.value)}>
                  <option value="">選択してください</option>
                  {PERIOD_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>結婚前の同棲{REQ}</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {(['yes', 'no'] as const).map(v => (
                    <button key={v} type="button" onClick={() => { setCohabitation(v); if (v === 'no') setCohabitationPeriod('') }} style={{
                      flex: 1, padding: '8px', border: '1px solid',
                      borderRadius: 'var(--rsm)', fontSize: 13, cursor: 'pointer',
                      background: cohabitation === v ? 'var(--pk50)' : '#fff',
                      borderColor: cohabitation === v ? 'var(--pk400)' : '#E8E6E0',
                      color: cohabitation === v ? 'var(--pk800)' : 'var(--g600)',
                      fontWeight: cohabitation === v ? 600 : 400,
                    }}>
                      {v === 'yes' ? 'していた' : 'していない'}
                    </button>
                  ))}
                </div>
              </div>

              {cohabitation === 'yes' && (
                <div className="field">
                  <label>同棲期間{REQ}</label>
                  <select value={cohabitationPeriod} onChange={e => setCohabitationPeriod(e.target.value)}>
                    <option value="">選択してください</option>
                    {PERIOD_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              )}

              <div className="field">
                <label>結婚の決め手{REQ}<span style={{ fontSize: 11, color: 'var(--g500)', fontWeight: 400, marginLeft: 6 }}>複数選択可</span></label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
                  {TRIGGER_TAGS.map(tag => (
                    <span key={tag} onClick={() => toggleTrigger(tag)}
                      className={`tag${triggers.includes(tag) ? ' active-p' : ''}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                {triggers.includes('その他') && (
                  <input type="text" placeholder="具体的に教えてください"
                    value={triggerOther} onChange={e => setTriggerOther(e.target.value)}
                    style={{ marginTop: 8 }} />
                )}
              </div>

              <div className="field">
                <label>満足度{OPT}</label>
                <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} onClick={() => setSatisfaction(n)} style={{
                      height: 12, flex: 1, borderRadius: 4, cursor: 'pointer',
                      background: n <= satisfaction ? SATISFACTION_COLORS[satisfaction - 1] : 'var(--g100)',
                      border: `1px solid ${n <= satisfaction ? SATISFACTION_COLORS[satisfaction - 1] : '#E8E6E0'}`,
                      transition: 'background .1s',
                    }} />
                  ))}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 4,
                  color: satisfaction ? SATISFACTION_COLORS[satisfaction - 1] : 'var(--g600)',
                }}>
                  {satisfaction ? SATISFACTION_LABELS[satisfaction - 1] : 'タップして選択'}
                </div>
              </div>

              <div className="field">
                <label>現在の状況{REQ}</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="">選択してください</option>
                  {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="field">
                <label>よかったこと・後悔していること{OPT}</label>
                <textarea value={reflection} onChange={e => setReflection(e.target.value)}
                  placeholder="例：精神的な安定感は増したが、自由な時間が減った。" />
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label>結婚前の方へのアドバイス{OPT}</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="例：貯金が少なくても何とかなる。相手選びが全て。" />
              </div>
            </div>

            {/* 指輪・結婚式・新婚旅行カード */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--pk50)', color: 'var(--pk400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                  <i className="ti ti-diamond" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>指輪・結婚式・新婚旅行のこと</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>婚約指輪（万円）</label>
                  <input type="number" placeholder="例：30" value={engagementRing}
                    onChange={e => setEngagementRing(e.target.value)} />
                </div>
                <div className="field">
                  <label>結婚指輪・2人分（万円）</label>
                  <input type="number" placeholder="例：20" value={weddingRing}
                    onChange={e => setWeddingRing(e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>結婚式</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {(['yes', 'no'] as const).map(v => (
                    <button key={v} type="button" onClick={() => setHadWedding(v)} style={{
                      flex: 1, padding: '8px', border: '1px solid',
                      borderRadius: 'var(--rsm)', fontSize: 13, cursor: 'pointer',
                      background: hadWedding === v ? 'var(--pk50)' : '#fff',
                      borderColor: hadWedding === v ? 'var(--pk400)' : '#E8E6E0',
                      color: hadWedding === v ? 'var(--pk800)' : 'var(--g600)',
                      fontWeight: hadWedding === v ? 600 : 400,
                    }}>
                      {v === 'yes' ? 'した' : 'しなかった'}
                    </button>
                  ))}
                </div>
              </div>

              {hadWedding === 'yes' && (
                <div className="field">
                  <label>結婚式の費用（万円）</label>
                  <input type="number" placeholder="例：300" value={weddingCost}
                    onChange={e => setWeddingCost(e.target.value)} />
                </div>
              )}

              <div className="field">
                <label>新婚旅行</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {(['yes', 'no'] as const).map(v => (
                    <button key={v} type="button" onClick={() => setHadHoneymoon(v)} style={{
                      flex: 1, padding: '8px', border: '1px solid',
                      borderRadius: 'var(--rsm)', fontSize: 13, cursor: 'pointer',
                      background: hadHoneymoon === v ? 'var(--pk50)' : '#fff',
                      borderColor: hadHoneymoon === v ? 'var(--pk400)' : '#E8E6E0',
                      color: hadHoneymoon === v ? 'var(--pk800)' : 'var(--g600)',
                      fontWeight: hadHoneymoon === v ? 600 : 400,
                    }}>
                      {v === 'yes' ? '行った' : '行かなかった'}
                    </button>
                  ))}
                </div>
              </div>

              {hadHoneymoon === 'yes' && (
                <div className="field">
                  <label>新婚旅行の費用（万円）</label>
                  <input type="number" placeholder="例：40" value={honeymoon}
                    onChange={e => setHoneymoon(e.target.value)} />
                </div>
              )}

              <div className="field" style={{ marginBottom: 0 }}>
                <label>指輪・結婚式・新婚旅行について{OPT}</label>
                <textarea
                  value={ceremonyNote}
                  onChange={e => setCeremonyNote(e.target.value)}
                  placeholder="例：指輪はこだわらず2人でシンプルなものにした。式はコロナ禍で親族のみで行い費用を抑えられた。"
                />
              </div>
            </div>

            {/* 子どものことカード */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--tc50)', color: 'var(--tc600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                  <i className="ti ti-baby-carriage" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>子どものこと</span>
              </div>

              <div className="field" style={{ marginBottom: hasKids === 'いる' ? undefined : 0 }}>
                <label>子どもの有無{REQ}</label>
                <select value={hasKids} onChange={e => setHasKids(e.target.value)}>
                  <option value="">選択してください</option>
                  {KIDS_STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {hasKids === 'いる' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 0 }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>人数{REQ}</label>
                    <input type="number" placeholder="例：2" min={1} value={kidsCount}
                      onChange={e => setKidsCount(e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>第一子の出産（結婚何年目）{REQ}</label>
                    <input type="number" placeholder="例：2" min={1} value={firstChildYear}
                      onChange={e => setFirstChildYear(e.target.value)} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>第一子時の貯金（万円）{REQ}</label>
                    <input type="number" placeholder="例：200" value={firstChildSaving}
                      onChange={e => setFirstChildSaving(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
            {/* 現在の状況カード */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--am50)', color: 'var(--am600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                }}>
                  <i className="ti ti-calendar-stats" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>現在の状況</span>
                <span style={{ fontSize: 11, color: 'var(--g500)' }}>すべて任意</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>現在の年齢（歳）{OPT}</label>
                  <input type="number" placeholder="例：32" value={currentAge}
                    onChange={e => setCurrentAge(e.target.value)} />
                </div>
                <div className="field">
                  <label>現在の子どもの人数{OPT}</label>
                  <input type="number" placeholder="例：1" min={0} value={currentKidsCount}
                    onChange={e => setCurrentKidsCount(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div className="field">
                  <label>現在の年収（万円）{OPT}</label>
                  <input type="number" placeholder="例：500" value={currentIncome}
                    onChange={e => setCurrentIncome(e.target.value)} />
                </div>
                <div className="field">
                  <label>世帯年収（万円）{OPT}</label>
                  <input type="number" placeholder="例：900" value={currentHouseholdIncome}
                    onChange={e => setCurrentHouseholdIncome(e.target.value)} />
                </div>
                <div className="field">
                  <label>現在の貯金（万円）{OPT}</label>
                  <input type="number" placeholder="例：300" value={currentSavings}
                    onChange={e => setCurrentSavings(e.target.value)} />
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>現在の生活について{OPT}</label>
                <textarea
                  value={currentNote}
                  onChange={e => setCurrentNote(e.target.value)}
                  placeholder="例：共働きで安定してきた。子育てが大変だけど充実している。"
                />
              </div>
            </div>
          </>
        )}

        {/* ── 結婚前 詳細フォーム ── */}
        {userType === 'before' && (
          <>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.1rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--pk50)', color: 'var(--pk400)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>
                <i className="ti ti-heart-broken" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>今の悩み・不安</span>
            </div>

            <div className="field">
              <label>結婚への不安度{REQ}</label>
              <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} onClick={() => setAnxietyLevel(n)} style={{
                    height: 12, flex: 1, borderRadius: 4, cursor: 'pointer',
                    background: n <= anxietyLevel ? ANXIETY_COLORS[anxietyLevel - 1] : 'var(--g100)',
                    border: `1px solid ${n <= anxietyLevel ? ANXIETY_COLORS[anxietyLevel - 1] : '#E8E6E0'}`,
                    transition: 'background .1s',
                  }} />
                ))}
              </div>
              <div style={{
                fontSize: 12, marginTop: 4,
                color: anxietyLevel ? ANXIETY_COLORS[anxietyLevel - 1] : 'var(--g600)',
              }}>
                {anxietyLevel ? ANXIETY_LABELS[anxietyLevel - 1] : 'タップして選択'}
              </div>
            </div>

            <div className="field">
              <label>悩んでいること{REQ}<span style={{ fontSize: 11, color: 'var(--g500)', fontWeight: 400, marginLeft: 6 }}>複数選択可</span></label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
                {CONCERN_TAGS.map(tag => (
                  <span key={tag} onClick={() => toggleConcernTag(tag)}
                    className={`tag${concernTags.includes(tag) ? ' active-t' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
              {concernTags.includes('その他') && (
                <input type="text" placeholder="具体的に教えてください"
                  value={concernOther} onChange={e => setConcernOther(e.target.value)}
                  style={{ marginTop: 8 }} />
              )}
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>今の気持ちを自由に{OPT}</label>
              <textarea
                value={worryNote}
                onChange={e => setWorryNote(e.target.value)}
                placeholder="例：お互い好きだけど、彼がなかなか動いてくれない。年齢的にも焦りを感じている。"
              />
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--am50)', color: 'var(--am600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>
                <i className="ti ti-coin" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>お金・将来のイメージ</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="field">
                <label>必要だと思う貯金額（万円）{REQ}</label>
                <input type="number" placeholder="例：300" value={neededSavings}
                  onChange={e => setNeededSavings(e.target.value)} />
              </div>
              <div className="field">
                <label>指輪の予算イメージ（万円）{REQ}</label>
                <input type="number" placeholder="例：20" value={ringBudget}
                  onChange={e => setRingBudget(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>結婚後の働き方イメージ{REQ}</label>
              <select value={workPlan} onChange={e => setWorkPlan(e.target.value)}>
                <option value="">選択してください</option>
                {WORK_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>子どもについて{REQ}</label>
              <select value={kidsPlan} onChange={e => setKidsPlan(e.target.value)}>
                <option value="">選択してください</option>
                {KIDS_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          </>
        )}

        {error && (
          <div style={{
            marginBottom: '.85rem', padding: '.65rem .85rem',
            background: '#FEF2F2', borderRadius: 'var(--rsm)',
            fontSize: 13, color: '#B91C1C',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="sbtn sbtn-pk"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '保存中...' : isEdit ? '保存する →' : '保存して始める →'}
        </button>
      </form>
    </>
  )
}
