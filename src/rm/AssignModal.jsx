import { useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

export default function AssignModal({ review, pages, onAssign, onClose }) {
  const [selected, setSelected] = useState(() => new Set(review.pageIds))

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAssign() {
    onAssign(review.id, [...selected])
  }

  return (
    <div className="popup" role="dialog" aria-modal="true">
      <div className="popup__card assign-modal">
        <div className="assign-modal__head">
          <div>
            <h3>Assign to pages</h3>
            <p>Tick one or more product / landing page titles.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <ul className="assign-modal__list">
          {pages.map((page) => (
            <li key={page.id}>
              <label className={selected.has(page.id) ? 'is-checked' : ''}>
                <input
                  type="checkbox"
                  checked={selected.has(page.id)}
                  onChange={() => toggle(page.id)}
                />
                <span>{page.title}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="assign-modal__actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={selected.size === 0}
            onClick={handleAssign}
          >
            <FiCheck />
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}
