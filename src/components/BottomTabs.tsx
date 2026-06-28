'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/top',    icon: 'ti-home',        label: 'トップ' },
  { href: '/',       icon: 'ti-messages',    label: '悩み' },
  { href: '/senpai', icon: 'ti-database',    label: '先輩DB' },
  { href: '/post',   icon: 'ti-circle-plus', label: '投稿' },
  { href: '/mypage', icon: 'ti-user-circle', label: 'マイページ' },
]

export default function BottomTabs() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div style={{
      position: 'sticky',
      top: 50,
      left: 0,
      right: 0,
      background: '#fff',
      borderBottom: 'var(--bd)',
      display: 'flex',
      zIndex: 99,
      height: 50,
    }}>
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            fontSize: 10,
            color: isActive(tab.href) ? 'var(--pk400)' : 'var(--g600)',
            textDecoration: 'none',
          }}
        >
          <i className={`ti ${tab.icon}`} style={{ fontSize: 18 }} />
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
