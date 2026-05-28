import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="app">
      <div className="frame frame-with-nav">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}

export function FocusShell() {
  return (
    <div className="app">
      <div className="frame">
        <Outlet />
      </div>
    </div>
  )
}
