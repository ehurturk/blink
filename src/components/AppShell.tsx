import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="app">
      <div className="frame">
        <TopBar />
        <Outlet />
      </div>
    </div>
  )
}
