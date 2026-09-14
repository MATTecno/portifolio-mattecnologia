import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import AdsLandingPage from './pages/AdsLandingPage'
import './styles.css'
import './commercial.css'

createRoot(document.getElementById('root')!).render(<AdsLandingPage />)
initAnalytics({ pageType: 'commercial' })
mountPrivacyControls('commercial')
