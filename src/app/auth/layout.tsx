import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ログイン / 新規登録 | MARILOG',
  description: 'MARILOGに登録して、先輩の体験談を参考にしたり、結婚の悩みを相談しよう。',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
