import { NavLink } from 'react-router-dom'

const HomeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
  </svg>
)

const StatsIcon = (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink to="/" end className="nav-tab">
        {HomeIcon}
        <span>Home</span>
      </NavLink>
      <NavLink to="/stats" className="nav-tab">
        {StatsIcon}
        <span>Stats</span>
      </NavLink>
    </nav>
  )
}
