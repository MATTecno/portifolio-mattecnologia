import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import BajaCampaignPage from './pages/BajaCampaignPage'
import './styles.css'
import './commercial.css'
import './baja.css'

createRoot(document.getElementById('root')!).render(<BajaCampaignPage />)
initAnalytics({ pageType: 'baja' })
mountPrivacyControls('commercial')
