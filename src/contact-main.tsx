import { mountPage } from './lib/mountPage'
import ContactPage from './pages/ContactPage'
import { getProjectReference } from './lib/estimate'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import './styles.css'
import './commercial.css'
import './editorial.css'

const initialReference = getProjectReference(new URL(window.location.href))
mountPage(
  document.getElementById('root')!,
  <ContactPage initialReference={initialReference} />,
  Boolean(initialReference)
)
initAnalytics({ pageType: 'commercial' })
mountPrivacyControls('commercial')
