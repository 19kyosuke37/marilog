import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{
      background: '#fff',
      borderBottom: 'var(--bd)',
      padding: '0 1.25rem',
      height: 50,
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/top" style={{
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--pk600)',
        letterSpacing: '0.06em',
        textDecoration: 'none',
      }}>
        💍 MARILOG
      </Link>
    </nav>
  )
}
