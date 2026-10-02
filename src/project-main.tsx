import { mountPage } from './lib/mountPage'
import { getProjectBySlug } from './data/projects'
import { initAnalytics } from './lib/analytics'
import { mountPrivacyControls } from './lib/privacy-controls'
import ProjectCasePage from './pages/ProjectCasePage'
import './styles.css'
import './commercial.css'
import './editorial.css'

const rootElement = document.getElementById('root')
const slug = rootElement?.dataset.projectSlug
const project = slug ? getProjectBySlug(slug) : undefined

if (!rootElement || !project) {
  throw new Error(`Case de projeto não encontrado: ${slug ?? 'slug ausente'}`)
}

mountPage(rootElement, <ProjectCasePage project={project} />)
initAnalytics({ pageType: 'case' })
mountPrivacyControls('commercial')
