'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/actions'

const TAGS = ['家事・育児の分担', 'お金・家計', '義実家・親族関係', 'コミュニケーション不足', '仕事とのバランス', '子育て', 'セックスレス', '離婚を考えている', 'その他']

export default function MarriedPostForm({ hasSenpai }: { hasSenpai: boolean }) {
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
        post_type: 'married',
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
          同じ悩みを持つ人からのコメントが届くかもしれません。
        </p>
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
        background: 'var(--pk50)', borderRadius: 'var(--rlg)',
        padding: '1.1rem 1.4rem', marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: '.2rem', color: 'var(--pk800)' }}>
          <i className="ti ti-rings" /> 投稿する（既婚）
        </h2>
        <p style={{ fontSize: 13, color: 'var(--pk600)' }}>今の悩みや、先輩としての経験をシェアしてください</p>
      </div>

      {!hasSenpai && (
        <div style={{
          background: 'var(--am50)', border: '1px solid var(--am200)',
          borderRadius: 'var(--rmd)', padding: '.85rem 1rem', marginBottom: '1rem',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <i className="ti ti-database-exclamation" style={{ fontSize: 18, color: 'var(--am600)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--am700)', marginBottom: 2 }}>
              先輩データベースに未登録です
            </div>
            <div style={{ fontSize: 12, color: 'var(--am600)', lineHeight: 1.6 }}>
              プロフィールを充実させると先輩DBに掲載され、結婚前の方の参考になります。
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="field">
          <label>悩みのカテゴリ（複数選択OK）</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
            {TAGS.map(tag => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag${selectedTags.includes(tag) ? ' active-p' : ''}`}
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
            placeholder="例：子どもが生まれてから会話が減った。家事の分担でよくケンカになる。"
            style={{ height: 100 }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || !body.trim()}
        className="sbtn sbtn-pk"
        style={{ opacity: isPending || !body.trim() ? 0.6 : 1 }}
      >
        {isPending ? '投稿中...' : '投稿する →'}
      </button>
    </>
  )
}
