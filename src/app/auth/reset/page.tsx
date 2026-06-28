'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: 48, color: 'var(--tc400)', marginBottom: '1rem' }}>
          <i className="ti ti-mail-check" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.75rem' }}>メールを送信しました</h2>
        <p style={{ fontSize: 13, color: 'var(--g600)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          <strong>{email}</strong> にパスワードリセット用のリンクを送りました。<br />
          メール内のリンクをクリックして新しいパスワードを設定してください。
        </p>
        <div style={{
          background: 'var(--am50)', borderRadius: 'var(--rmd)',
          padding: '1rem', fontSize: 13, color: 'var(--am600)', marginBottom: '1.5rem',
        }}>
          <i className="ti ti-info-circle" /> メールが届かない場合は迷惑メールフォルダを確認してください
        </div>
        <Link href="/auth" style={{
          background: 'none', border: 'var(--bd)', borderRadius: 'var(--rmd)',
          padding: '10px 24px', fontSize: 14, color: 'var(--g600)', textDecoration: 'none', display: 'inline-block',
        }}>
          ← ログインに戻る
        </Link>
      </div>
    )
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 36, color: 'var(--pk400)', marginBottom: '.5rem' }}>
          <i className="ti ti-lock-open" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '.3rem' }}>パスワードをリセット</h1>
        <p style={{ fontSize: 13, color: 'var(--g600)' }}>登録済みのメールアドレスを入力してください</p>
      </div>

      <div className="card">
        <form onSubmit={handleReset}>
          <div className="field" style={{ marginBottom: 0 }}>
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
            {loading ? '送信中...' : 'リセットメールを送る →'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: 'var(--g600)', textAlign: 'center', marginTop: '.75rem' }}>
        <Link href="/auth" style={{ color: 'var(--pk600)', textDecoration: 'none' }}>
          ← ログインに戻る
        </Link>
      </p>
    </>
  )
}
