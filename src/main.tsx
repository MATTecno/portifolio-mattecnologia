import { createRoot } from 'react-dom/client'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import App from './pages/App'
import './styles.css'
import './commercial.css'
import { getProjectReference } from './lib/estimate'

// Read the allowed project ID before analytics removes query parameters.
const initialReference = getProjectReference(new URL(window.location.href))
createRoot(document.getElementById('root')!).render(<App initialReference={initialReference} />)
initAnalytics({ pageType: 'commercial' })
mountPrivacyControls('commercial')
