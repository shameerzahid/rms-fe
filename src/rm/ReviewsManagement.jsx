import { useState } from 'react'
import { FiInbox } from 'react-icons/fi'
import AddReview from './AddReview.jsx'
import AssignModal from './AssignModal.jsx'
import BuyerPreview from './BuyerPreview.jsx'
import PageRatings from './PageRatings.jsx'
import Popup from './Popup.jsx'
import ReviewCard from './ReviewCard.jsx'
import { usePages } from './usePages.js'
import './rm.css'

export default function ReviewsManagement({ view, api, onNavigate }) {
  const {
    reviews,
    loading,
    error,
    addReview,
    submitCustomerReview,
    updateReview,
    deleteReview,
    assignPages,
    togglePin,
  } = api
  const { pages, pageTitle, refresh: refreshPages } = usePages()

  const [popup, setPopup] = useState('')
  const [assigning, setAssigning] = useState(null)

  async function handleAdd(fields) {
    await addReview(fields)
    setPopup('Review submitted successfully and moved to All reviews.')
    onNavigate('rm-all')
  }

  async function handleAssign(id, pageIds) {
    await assignPages(id, pageIds)
    setAssigning(null)
    setPopup('Review successfully assigned to relevant pages')
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return
    await deleteReview(id)
  }

  const assigned = reviews
    .filter((r) => r.pageIds.length > 0)
    .slice()
    .sort((a, b) => Number(b.pinned) - Number(a.pinned))

  if (loading) {
    return <p className="rm__empty">Loading reviews…</p>
  }

  if (error) {
    return <p className="form-error">{error}</p>
  }

  return (
    <section className="rm">
      {view === 'rm-overview' && (
        <PageRatings reviews={reviews} pages={pages} onSynced={refreshPages} />
      )}
      {view === 'rm-add' && <AddReview onAdd={handleAdd} />}
      {view === 'rm-all' && (
        <ReviewList
          items={reviews}
          pageTitle={pageTitle}
          empty="No reviews yet. Add one from Add review."
          onEdit={updateReview}
          onDelete={handleDelete}
          onAssign={setAssigning}
        />
      )}
      {view === 'rm-assigned' && (
        <ReviewList
          items={assigned}
          pageTitle={pageTitle}
          empty="No assigned reviews yet. Assign a review from All reviews."
          showPin
          onEdit={updateReview}
          onDelete={handleDelete}
          onAssign={setAssigning}
          onTogglePin={togglePin}
        />
      )}
      {view === 'rm-buyer' && (
        <BuyerPreview
          reviews={reviews}
          pages={pages}
          onCustomerReview={submitCustomerReview}
        />
      )}

      {assigning && (
        <AssignModal
          review={assigning}
          pages={pages}
          onAssign={handleAssign}
          onClose={() => setAssigning(null)}
        />
      )}

      <Popup message={popup} onClose={() => setPopup('')} />
    </section>
  )
}

function ReviewList({
  items,
  empty,
  pageTitle,
  showPin,
  onEdit,
  onDelete,
  onAssign,
  onTogglePin,
}) {
  if (items.length === 0) {
    return (
      <div className="rm__empty">
        <FiInbox />
        <p>{empty}</p>
      </div>
    )
  }

  return (
    <div className="review-list">
      {items.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          pageTitle={pageTitle}
          showPin={showPin}
          onEdit={onEdit}
          onDelete={onDelete}
          onAssign={onAssign}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  )
}
