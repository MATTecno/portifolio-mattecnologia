import { mountPage } from './lib/mountPage'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import App from './pages/App'
import './styles.css'
import './commercial.css'
import './editorial.css'
import './art-direction.css'
import { getProjectReference } from './lib/estimate'

// Read the allowed project ID before analytics removes query parameters.
const initialReference = getProjectReference(new URL(window.location.href))
if (window.location.hash === '#estimativa') window.location.replace(`/contato/${window.location.search}#estimativa`)
mountPage(document.getElementById('root')!, <App initialReference={initialReference} />, Boolean(initialReference))
initAnalytics({ pageType: 'commercial' })
mountPrivacyControls('commercial')
