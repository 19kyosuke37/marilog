import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import BottomTabs from '@/components/BottomTabs'

export const metadata: Metadata = {
  title: 'MARILOG — 結婚のリアルをシェアしよう',
  description: '自分と似た条件の先輩が、結婚してどうなったか。データで知る、体験談で知る。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body>
        <Nav />
        <BottomTabs />
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '1.25rem 1rem 2rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
