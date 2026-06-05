import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardMockupPage from '../views/pages/DashboardMockupPage'
import DashboardPage from '../views/pages/DashboardPage'
import FarmPage from '../views/pages/FarmPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/farm" element={<FarmPage />} />
        <Route path="/demo" element={<DashboardMockupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
