import { mountPage } from './lib/mountPage'
import ProjectsIndexPage from './pages/ProjectsIndexPage'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import './styles.css'
import './commercial.css'
import './editorial.css'

mountPage(document.getElementById('root')!, <ProjectsIndexPage />)
initAnalytics({ pageType: 'case' })
mountPrivacyControls('commercial')
