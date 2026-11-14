import {
  FiStar,
  FiPlusCircle,
  FiList,
  FiCheckSquare,
  FiShoppingBag,
  FiBriefcase,
  FiLogOut,
  FiBarChart2,
  FiX,
} from 'react-icons/fi'
import './Sidebar.css'

const RM_ITEMS = [
  { id: 'rm-overview', label: 'Page ratings', icon: FiBarChart2 },
  { id: 'rm-add', label: 'Add review', icon: FiPlusCircle },
  { id: 'rm-all', label: 'All reviews', icon: FiList },
  { id: 'rm-assigned', label: 'Assigned reviews', icon: FiCheckSquare },
  { id: 'rm-buyer', label: 'Buyer preview', icon: FiShoppingBag },
]

export default function Sidebar({
  active,
  onNavigate,
  userEmail,
  onLogout,
  open,
  onClose,
  counts,
}) {
  return (
    <>
      {open && <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <span className="sidebar__mark">
              <FiStar />
            </span>
            <div>
              <strong>RMS Admin</strong>
              <span>Reviews &amp; operations</span>
            </div>
          </div>
          <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__label">Reviews Management</p>
          {RM_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`sidebar__link ${active === id ? 'is-active' : ''}`}
              onClick={() => {
                onNavigate(id)
                onClose()
              }}
            >
              <Icon />
              <span>{label}</span>
              {id === 'rm-all' && counts.all > 0 && (
                <em className="sidebar__badge">{counts.all}</em>
              )}
              {id === 'rm-assigned' && counts.assigned > 0 && (
                <em className="sidebar__badge">{counts.assigned}</em>
              )}
            </button>
          ))}

          <p className="sidebar__label">Business</p>
          <button
            type="button"
            className={`sidebar__link ${active === 'bm' ? 'is-active' : ''}`}
            onClick={() => {
              onNavigate('bm')
              onClose()
            }}
          >
            <FiBriefcase />
            <span>Business Management</span>
            <em className="sidebar__pending">Soon</em>
          </button>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <span className="sidebar__avatar">{userEmail.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>Admin</strong>
              <span>{userEmail}</span>
            </div>
          </div>
          <button type="button" className="sidebar__logout" onClick={onLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
