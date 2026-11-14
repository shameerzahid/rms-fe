import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    try {
      const data = await api.getReviews()
      setReviews(data)
    } catch (err) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addReview(fields) {
    const auth = fields.source !== 'customer'
    const created = await api.createReview(fields, { auth })
    setReviews((prev) => [created, ...prev])
    return created
  }

  async function updateReview(id, patch) {
    const updated = await api.updateReview(id, patch)
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)))
    return updated
  }

  async function deleteReview(id) {
    await api.deleteReview(id)
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  async function assignPages(id, pageIds) {
    return updateReview(id, { pageIds })
  }

  async function togglePin(id) {
    const current = reviews.find((r) => r.id === id)
    if (!current) return
    return updateReview(id, { pinned: !current.pinned })
  }

  return {
    reviews,
    loading,
    error,
    refresh,
    addReview,
    updateReview,
    deleteReview,
    assignPages,
    togglePin,
  }
}
