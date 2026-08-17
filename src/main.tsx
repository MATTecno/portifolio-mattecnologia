import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import App from './pages/App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
initAnalytics({ pageType: 'commercial' })
mountPrivacyControls()
