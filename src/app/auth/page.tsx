'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Tab = 'login' | 'signup'

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function toJa(msg: string) {
    if (msg.includes('Invalid login credentials')) return 'メールアドレスまたはパスワードが正しくありません'
    if (msg.includes('Email not confirmed')) return 'メールアドレスの確認が完了していません。登録メールのリンクをクリックしてください'
    if (msg.includes('User already registered')) return 'このメールアドレスはすでに登録されています'
    if (msg.includes('Password should be')) return 'パスワードは6文字以上にしてください'
    if (msg.includes('Unable to validate email')) return 'メールアドレスの形式が正しくありません'
    return msg
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (tab === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        if (!data.session) {
          setConfirmationSent(true)
          return
        }
        router.push('/auth/profile')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(toJa(err instanceof Error ? err.message : 'エラーが発生しました'))
    } finally {
      setLoading(false)
    }
  }

  if (confirmationSent) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: 48, color: 'var(--tc400)', marginBottom: '1rem' }}>
          <i className="ti ti-mail-check" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.75rem' }}>確認メールを送信しました</h2>
        <p style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          <strong>{email}</strong> に確認メールを送りました。<br />
          メール内のリンクをクリックすると<br />
          プロフィール設定に進めます。
        </p>
        <div style={{
          background: 'var(--am50)', borderRadius: 'var(--rmd)',
          padding: '1rem', fontSize: 13, color: 'var(--am600)', marginBottom: '1.5rem',
        }}>
          <i className="ti ti-info-circle" /> メールが届かない場合は迷惑メールフォルダを確認してください
        </div>
        <button
          onClick={() => setConfirmationSent(false)}
          style={{
            background: 'none', border: 'var(--bd)', borderRadius: 'var(--rmd)',
            padding: '10px 24px', fontSize: 14, color: 'var(--g600)', cursor: 'pointer',
          }}
        >
          ← 戻る
        </button>
      </div>
    )
  }

  const tabs: [Tab, string][] = [['signup', '新規登録'], ['login', 'ログイン']]

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 36, color: 'var(--pk400)', marginBottom: '.5rem' }}>
          <i className="ti ti-rings" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '.3rem' }}>MARILOG</h1>
        <p style={{ fontSize: 13, color: 'var(--g600)' }}>結婚のリアルをシェアしよう</p>
      </div>

      <div style={{ display: 'flex', borderBottom: 'var(--bd)', marginBottom: '1.25rem' }}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setError('') }}
            style={{
              flex: 1, padding: '10px', fontSize: 14,
              color: tab === key ? 'var(--pk600)' : 'var(--g600)',
              border: 'none', borderBottom: `2px solid ${tab === key ? 'var(--pk400)' : 'transparent'}`,
              background: 'none', fontWeight: tab === key ? 600 : 400,
              cursor: 'pointer', marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>メールアドレス</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>
              パスワード
              {tab === 'signup' && <span style={{ fontSize: 11, color: 'var(--g600)', marginLeft: 6 }}>（6文字以上）</span>}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <div style={{
              marginTop: '.85rem', padding: '.65rem .85rem',
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
            {loading ? '処理中...' : tab === 'signup' ? '登録してプロフィールを入力 →' : 'ログイン →'}
          </button>
        </form>
      </div>

      {tab === 'login' && (
        <p style={{ fontSize: 12, color: 'var(--g600)', textAlign: 'center', marginTop: '.5rem' }}>
          <Link href="/auth/reset" style={{ color: 'var(--pk600)', textDecoration: 'none' }}>
            パスワードをお忘れですか？
          </Link>
        </p>
      )}

      <p style={{ fontSize: 12, color: 'var(--g600)', textAlign: 'center', marginTop: '.5rem' }}>
        {tab === 'signup' ? (
          <>すでにアカウントをお持ちの方は{' '}
            <button onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: 'var(--pk600)', cursor: 'pointer', fontSize: 12, padding: 0 }}>
              ログイン
            </button>
          </>
        ) : (
          <>アカウントをお持ちでない方は{' '}
            <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: 'var(--pk600)', cursor: 'pointer', fontSize: 12, padding: 0 }}>
              新規登録
            </button>
          </>
        )}
      </p>
    </>
  )
}
