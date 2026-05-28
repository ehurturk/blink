import { Link, useLocation } from 'react-router-dom'

const ProfileIcon = (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
  </svg>
)

const BackIcon = (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export function TopBar() {
  const { pathname } = useLocation()
  const onStats = pathname === '/stats'
  return (
    <header className="topbar">
      {onStats ? (
        <Link to="/" className="topbar-icon" aria-label="Home">
          {BackIcon}
        </Link>
      ) : (
        <Link
          to="/stats"
          className="topbar-icon"
          aria-label="Your activity"
        >
          {ProfileIcon}
        </Link>
      )}
    </header>
  )
}
