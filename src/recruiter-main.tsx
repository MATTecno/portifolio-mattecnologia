import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RecruiterPage from './pages/RecruiterPage'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecruiterPage />
  </StrictMode>,
)
