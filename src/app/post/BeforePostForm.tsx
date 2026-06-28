'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions'

const TAGS = ['お金・貯金が不安', 'タイミングがわからない', '相手との温度差', 'そもそも結婚すべきか', '子どものこと', '住む場所', '仕事とのバランス', '親への紹介・挨拶', '相手の収入が不安', '自分の気持ちが揺れている', '性の不一致・相性が不安', 'その他']

export default function BeforePostForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [otherText, setOtherText] = useState('')
  const [body, setBody] = useState('')
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    if (tag === 'その他') setOtherText('')
  }

  function buildTags() {
    if (!selectedTags.includes('その他') || !otherText.trim()) return selectedTags
    return selectedTags.map(t => t === 'その他' ? `その他（${otherText.trim()}）` : t)
  }

  function handleSubmit() {
    if (!body.trim()) return
    startTransition(async () => {
      await createPost({
        post_type: 'before',
        concern_tags: buildTags(),
        body: body.trim(),
      })
      setDone(true)
      window.scrollTo(0, 0)
    })
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: 52, color: 'var(--tc400)', marginBottom: '1rem' }}>
          <i className="ti ti-circle-check" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: '.4rem' }}>投稿しました</h3>
        <p style={{ fontSize: 14, color: 'var(--g600)', marginBottom: '1.25rem' }}>
          あなたと似た状況を乗り越えた先輩のデータを表示します。
        </p>
        <div style={{
          background: 'var(--tc50)', borderRadius: 'var(--rmd)',
          padding: '1rem 1.25rem', textAlign: 'left', marginBottom: '1.25rem',
        }}>
          <p style={{ fontSize: 13, color: 'var(--tc800)', fontWeight: 600, marginBottom: '.4rem' }}>
            <i className="ti ti-search" /> こんな先輩が見つかりました
          </p>
          <span style={{ fontSize: 13, color: 'var(--tc600)' }}>
            先輩の投稿を見てみましょう
          </span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="sbtn sbtn-tc"
          style={{ marginBottom: 10 }}
        >
          みんなの悩みを見る →
        </button>
        <br />
        <button
          onClick={() => { setDone(false); setBody(''); setSelectedTags([]) }}
          style={{
            background: 'none', border: 'var(--bd)', borderRadius: 'var(--rmd)',
            padding: '10px 24px', fontSize: 14, color: 'var(--g600)', cursor: 'pointer',
          }}
        >
          もう一度投稿する
        </button>
      </div>
    )
  }

  return (
    <>
      <button onClick={() => router.back()} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', fontSize: 13,
        color: 'var(--g600)', cursor: 'pointer', marginBottom: '1rem', padding: 0,
      }}>
        <i className="ti ti-arrow-left" /> 戻る
      </button>

      <div style={{
        background: 'var(--tc50)', borderRadius: 'var(--rlg)',
        padding: '1.1rem 1.4rem', marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.2rem', color: 'var(--tc800)' }}>
          <i className="ti ti-message-circle-question" /> 投稿する（結婚前）
        </h2>
        <p style={{ fontSize: 13, color: 'var(--tc600)' }}>今の悩みをシェアしてください。先輩が答えてくれます。</p>
      </div>

      <div className="card">
          {/* タグ */}
        <div className="field">
          <label>悩んでいること（複数選択OK）</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
            {TAGS.map(tag => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag${selectedTags.includes(tag) ? ' active-t' : ''}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {selectedTags.includes('その他') && (
            <input
              type="text"
              placeholder="具体的に教えてください"
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label>詳しく教えてください</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="例：付き合って3年だけど、相手がまだ早いと言っている。28歳でそろそろ焦りを感じている。"
            style={{ height: 100 }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || !body.trim()}
        className="sbtn sbtn-tc"
        style={{ opacity: isPending || !body.trim() ? 0.6 : 1 }}
      >
        {isPending ? '投稿中...' : '投稿する →'}
      </button>
    </>
  )
}
