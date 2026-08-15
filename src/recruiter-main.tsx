import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import RecruiterPage from './pages/RecruiterPage'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecruiterPage />
  </StrictMode>,
)
initAnalytics({ pageType: 'recruiter' })
