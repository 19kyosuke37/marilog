import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SenpaiPage from './SenpaiPage'
import type { SenpaiItem } from './SenpaiPage'

export const metadata: Metadata = {
  title: '先輩データベース | MARILOG',
  description: 'エリア・満足度・年齢・状況で絞り込める既婚者データベース。自分と似た条件の先輩の体験を参考にしよう。',
  openGraph: {
    title: '先輩データベース | MARILOG',
    description: 'エリア・満足度・年齢・状況で絞り込める既婚者データベース。',
    type: 'website',
  },
}

export default async function SenpaiRoute() {
  const supabase = await createClient()

  const [{ data: { user } }, { data: senpaiRaw }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('senpai_profiles')
      .select('user_id, age_at_marriage, partner_age_at_marriage, income_at_marriage, saving_at_marriage, area, dating_period, marriage_triggers, satisfaction, current_status, message_to_undecided')
      .order('created_at', { ascending: false }),
  ])

  const senpaiList = (senpaiRaw ?? []) as Omit<SenpaiItem, 'nickname' | 'age' | 'gender'>[]

  const userIds = senpaiList.map(s => s.user_id)
  const safeIds = userIds.length ? userIds : ['_placeholder_']

  const { data: profilesRaw } = await supabase
    .from('profiles')
    .select('id, nickname, age, gender')
    .in('id', safeIds)

  const profiles = (profilesRaw ?? []) as { id: string; nickname: string; age: number | null; gender: string | null }[]

  const items: SenpaiItem[] = senpaiList.map(s => {
    const p = profiles.find(pr => pr.id === s.user_id)
    return {
      ...s,
      nickname: p?.nickname ?? 'ユーザー',
      age: p?.age ?? null,
      gender: p?.gender ?? null,
    }
  })

  return <SenpaiPage items={items} isLoggedIn={!!user} />
}
