import { useState } from 'react'
import { FiSend, FiStar } from 'react-icons/fi'

const today = () => new Date().toISOString().slice(0, 10)

export default function AddReview({ onAdd }) {
  const [rating, setRating] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [date, setDate] = useState(today)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!rating) {
      setError('Select a rating.')
      return
    }
    if (!displayName.trim()) {
      setError('Enter a display name.')
      return
    }
    if (!date) {
      setError('Enter a date.')
      return
    }
    if (!text.trim()) {
      setError('Write a review.')
      return
    }

    setSaving(true)
    try {
      await onAdd({ rating, displayName, date, text })
      setRating(0)
      setDisplayName('')
      setDate(today())
      setText('')
    } catch (err) {
      setError(err.message || 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel-card add-review" onSubmit={handleSubmit}>
      <div className="panel-card__head">
        <h2>Customer review</h2>
        <p>Create a review from the admin side, then assign it to store pages.</p>
      </div>

      <fieldset className="stars">
        <legend>Rating</legend>
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

      <div className="form-grid">
        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Customer name"
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <label>
        Write a review
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the review here…"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={saving}>
        <FiSend />
        {saving ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
