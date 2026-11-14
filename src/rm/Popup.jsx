import { FiCheckCircle } from 'react-icons/fi'

export default function Popup({ message, onClose }) {
  if (!message) return null

  return (
    <div className="popup" role="dialog" aria-modal="true">
      <div className="popup__card popup__card--success">
        <FiCheckCircle className="popup__icon" />
        <p>{message}</p>
        <button type="button" className="btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}
