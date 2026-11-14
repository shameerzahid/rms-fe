import { useEffect, useRef, useState } from 'react'
import {
  FiEdit2,
  FiLink,
  FiMoreVertical,
  FiStar,
  FiTrash2,
  FiMapPin,
} from 'react-icons/fi'
function Stars({ rating }) {
  return (
    <span className="stars-read" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar key={n} className={n <= rating ? 'is-on' : ''} />
      ))}
    </span>
  )
}

export default function ReviewCard({
  review,
  pageTitle,
  showPin,
  onEdit,
  onDelete,
  onAssign,
  onTogglePin,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(review.text)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function onDoc(e) {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

  function saveEdit() {
    const text = draft.trim()
    if (!text) return
    onEdit(review.id, { text })
    setEditing(false)
  }

  return (
    <article className="review-card">
      <div className="review-card__top">
        <div>
          <Stars rating={review.rating} />
          <span
            className={`review-card__chip ${
              review.source === 'admin' ? 'is-admin' : 'is-customer'
            }`}
          >
            {review.source === 'admin' ? 'Admin side' : 'Customer side'}
          </span>
          {review.pinned && (
            <span className="review-card__chip is-pin">
              <FiMapPin /> Pinned
            </span>
          )}
        </div>
        <div className="review-card__menu" ref={menuRef}>
          <button
            type="button"
            className="review-card__dots"
            aria-label="Review actions"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <FiMoreVertical />
          </button>
          {menuOpen && (
            <div className="review-card__dropdown">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setDraft(review.text)
                  setEditing(true)
                }}
              >
                <FiEdit2 /> Edit
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(review.id)
                }}
              >
                <FiTrash2 /> Delete
              </button>
              {showPin && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onTogglePin(review.id)
                  }}
                >
                  <FiMapPin /> {review.pinned ? 'Unpin' : 'Pin'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="review-card__edit">
          <textarea rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="review-card__edit-actions">
            <button type="button" className="btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={saveEdit}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="review-card__text">“{review.text}”</p>
      )}

      <p className="review-card__meta">
        <strong>{review.displayName}</strong>
        <span>·</span>
        {review.date}
      </p>

      {review.pageIds.length > 0 && (
        <p className="review-card__pages">
          <FiLink />
          {review.pageIds.map(pageTitle).join(', ')}
        </p>
      )}

      <button type="button" className="btn-assign" onClick={() => onAssign(review)}>
        <FiLink />
        Assign to pages
      </button>
    </article>
  )
}
