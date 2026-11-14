import { useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import Sidebar from '../layout/Sidebar.jsx'
import ReviewsManagement from '../rm/ReviewsManagement.jsx'
import { useReviews } from '../rm/useReviews.js'
import './Dashboard.css'

const TITLES = {
  'rm-overview': 'Page ratings',
  'rm-add': 'Add review',
  'rm-all': 'All reviews',
  'rm-assigned': 'Assigned reviews',
  'rm-buyer': 'Buyer preview',
  bm: 'Business Management',
}

export default function Dashboard({ user, onLogout }) {
  const [view, setView] = useState('rm-overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const reviewsApi = useReviews()

  const assignedCount = reviewsApi.reviews.filter((r) => r.pageIds.length > 0).length

  return (
    <div className="shell">
      <Sidebar
        active={view}
        onNavigate={setView}
        userEmail={user.email}
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        counts={{ all: reviewsApi.reviews.length, assigned: assignedCount }}
      />

      <div className="shell__main">
        <header className="topbar">
          <button
            type="button"
            className="topbar__menu"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu />
          </button>
          <div>
            <p className="topbar__eyebrow">
              {view === 'bm' ? 'Business' : 'Reviews Management'}
            </p>
            <h1>{TITLES[view]}</h1>
          </div>
        </header>

        <div className="shell__content">
          {view === 'bm' ? (
            <BmPlaceholder />
          ) : (
            <ReviewsManagement view={view} api={reviewsApi} onNavigate={setView} />
          )}
        </div>
      </div>
    </div>
  )
}

function BmPlaceholder() {
  return (
    <section className="empty-panel">
      <div className="empty-panel__icon">BM</div>
      <h2>Business Management</h2>
      <p className="empty-panel__pending">Pending — coming after Reviews Management.</p>
      <p>
        Members registration, dashboards, commissions, invoices, and monthly
        closing reports will live here.
      </p>
    </section>
  )
}
