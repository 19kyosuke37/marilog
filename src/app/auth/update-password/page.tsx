'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('パスワードが一致しません'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
    setTimeout(() => router.push('/'), 2500)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: 48, color: 'var(--tc400)', marginBottom: '1rem' }}>
          <i className="ti ti-circle-check" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.5rem' }}>パスワードを更新しました</h2>
        <p style={{ fontSize: 13, color: 'var(--g600)' }}>トップページに移動します...</p>
      </div>
    )
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 36, color: 'var(--pk400)', marginBottom: '.5rem' }}>
          <i className="ti ti-lock" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: '.3rem' }}>新しいパスワードを設定</h1>
        <p style={{ fontSize: 13, color: 'var(--g600)' }}>6文字以上のパスワードを設定してください</p>
      </div>

      <div className="card">
        <form onSubmit={handleUpdate}>
          <div className="field">
            <label>新しいパスワード</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>パスワードを再入力</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
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
            {loading ? '更新中...' : 'パスワードを更新する →'}
          </button>
        </form>
      </div>
    </>
  )
}
