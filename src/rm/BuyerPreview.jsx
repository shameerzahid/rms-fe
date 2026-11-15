import { useState } from 'react'
import { FiSend, FiStar, FiMapPin } from 'react-icons/fi'
import { pageAverage } from './ratings.js'

export default function BuyerPreview({ reviews, pages, onCustomerReview }) {
  const [pageId, setPageId] = useState(pages[0]?.id || '')
  const [rating, setRating] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [thanks, setThanks] = useState(false)
  const [saving, setSaving] = useState(false)

  const page = pages.find((p) => p.id === pageId) || pages[0]
  const activePageId = page?.id || ''
  const stats = activePageId ? pageAverage(reviews, activePageId) : null
  const pageReviews = reviews
    .filter((r) => r.pageIds.includes(activePageId))
    .slice()
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setThanks(false)

    if (!activePageId) {
      setError('No pages available.')
      return
    }
    if (!rating) {
      setError('Select a rating.')
      return
    }
    if (!displayName.trim() || !text.trim()) {
      setError('Enter your name and review.')
      return
    }

    setSaving(true)
    try {
      await onCustomerReview(activePageId, { rating, displayName, text })
      setRating(0)
      setDisplayName('')
      setText('')
      setThanks(true)
    } catch (err) {
      setError(err.message || 'Failed to submit')
    } finally {
      setSaving(false)
    }
  }

  if (!pages.length) {
    return <p className="rm__empty">No pages loaded from API yet.</p>
  }

  return (
    <div className="buyer">
      <p className="buyer__note">
        Frontend stand-in for the Shopify product / landing page reviews block.
      </p>

      <label className="buyer__page">
        Preview page
        <select
          value={activePageId}
          onChange={(e) => setPageId(e.target.value)}
        >
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </label>

      <div className="buyer__block panel-card">
        <div className="panel-card__head">
          <h2>Reviews — {page.title}</h2>
          {stats ? (
            <p className="buyer__avg">
              <span className="stars-read">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FiStar key={n} className={n <= Math.round(stats.average) ? 'is-on' : ''} />
                ))}
              </span>
              <strong>{stats.display}/5</strong>
              Based on {stats.count} review{stats.count === 1 ? '' : 's'}
            </p>
          ) : (
            <p className="buyer__avg buyer__avg--empty">No reviews yet on this page.</p>
          )}
        </div>

        <div className="buyer__list">
          {pageReviews.map((r) => (
            <article key={r.id} className="buyer__review">
              {r.pinned && (
                <span className="buyer__badge">
                  <FiMapPin /> Pinned
                </span>
              )}
              <p className="stars-read" aria-label={`${r.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <FiStar key={n} className={n <= r.rating ? 'is-on' : ''} />
                ))}
              </p>
              <p className="buyer__text">“{r.text}”</p>
              <p className="buyer__meta">
                <strong>{r.displayName}</strong> · {r.date}
              </p>
            </article>
          ))}
        </div>

        <form className="buyer__form" onSubmit={handleSubmit}>
          <h3>Write a review</h3>
          <fieldset className="stars">
            <legend>Your rating</legend>
            <div className="stars__row">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= rating ? 'is-on' : ''}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  onClick={() => setRating(n)}
                >
                  <FiStar />
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            Display name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label>
            Your review
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience…"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          {thanks && (
            <p className="buyer__thanks">Thanks — your review was submitted. It appears on this page once the admin assigns it.</p>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            <FiSend />
            {saving ? 'Submitting…' : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  )
}
