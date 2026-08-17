import { createRoot } from 'react-dom/client'
import { getProjectBySlug } from './data/projects'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import ProjectCasePage from './pages/ProjectCasePage'
import './styles.css'

const rootElement = document.getElementById('root')
const slug = rootElement?.dataset.projectSlug
const project = slug ? getProjectBySlug(slug) : undefined

if (!rootElement || !project) {
  throw new Error(`Case de projeto não encontrado: ${slug ?? 'slug ausente'}`)
}

createRoot(rootElement).render(<ProjectCasePage project={project} />)
initAnalytics({ pageType: 'case' })
mountPrivacyControls()
