import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/AppShell'
import { Home } from './screens/Home'
import { Session } from './screens/Session'
import { BreakCheckIn } from './screens/BreakCheckIn'
import { BreakPick } from './screens/BreakPick'
import { BreakActive } from './screens/BreakActive'
import { BreakOutcome } from './screens/BreakOutcome'
import { Stats } from './screens/Stats'
import './App.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/session" element={<Session />} />
            <Route path="/break/check-in" element={<BreakCheckIn />} />
            <Route path="/break/pick" element={<BreakPick />} />
            <Route path="/break/active" element={<BreakActive />} />
            <Route path="/break/outcome" element={<BreakOutcome />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
