import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import PrivacyPage from './pages/PrivacyPage'
import './styles.css'

createRoot(document.getElementById('root')!).render(<PrivacyPage />)
initAnalytics({ pageType: 'privacy' })
