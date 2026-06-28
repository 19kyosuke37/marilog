export type TrustBadge = {
  label: string
  icon: string
  color: string
  bg: string
}

export function getTrustBadge(points: number): TrustBadge | null {
  if (points >= 200) return { label: 'レジェンド', icon: 'ti-crown', color: '#92400E', bg: '#FEF3C7' }
  if (points >= 100) return { label: 'ベテラン', icon: 'ti-trophy', color: '#065F46', bg: '#D1FAE5' }
  if (points >= 50)  return { label: '信頼の先輩', icon: 'ti-award', color: '#1E40AF', bg: '#DBEAFE' }
  if (points >= 10)  return { label: 'サポーター', icon: 'ti-heart-handshake', color: '#9D174D', bg: '#FCE7F3' }
  return null
}
