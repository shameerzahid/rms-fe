import { useState } from 'react'
import { FiRefreshCw, FiStar, FiFileText } from 'react-icons/fi'
import { api } from '../api.js'
import { pageAverage } from './ratings.js'

export default function PageRatings({ reviews, pages, onSynced }) {
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  async function sync() {
    setSyncing(true)
    setMessage('')
    try {
      const data = await api.syncShopify()
      await onSynced?.()
      setMessage(`Synced ${data.count} Shopify pages.`)
    } catch (err) {
      setMessage(err.message || 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="page-ratings">
      <div className="page-ratings__head">
        <div>
          <h2>Page ratings overview</h2>
          <p>
            Auto-calculated from reviews assigned to each product / landing page.
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={sync} disabled={syncing}>
          <FiRefreshCw />
          {syncing ? 'Syncing…' : 'Sync Shopify pages'}
        </button>
      </div>
      {message && <p className="page-ratings__sync">{message}</p>}

      <div className="page-ratings__grid">
        {pages.map((page) => {
          const stats = pageAverage(reviews, page.id)
          return (
            <article key={page.id} className="rating-card">
              <div className="rating-card__icon">
                <FiFileText />
              </div>
              <h3>{page.title}</h3>
              {stats ? (
                <>
                  <p className="rating-card__score">
                    <FiStar />
                    <strong>{stats.display}</strong>
                    <span>/5</span>
                  </p>
                  <p className="rating-card__meta">
                    Based on {stats.count} review{stats.count === 1 ? '' : 's'}
                  </p>
                </>
              ) : (
                <p className="rating-card__none">No reviews assigned</p>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
