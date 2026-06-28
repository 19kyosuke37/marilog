'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 13, color: 'var(--g600)', background: 'none',
        border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1rem',
      }}
    >
      <i className="ti ti-arrow-left" /> 戻る
    </button>
  )
}
