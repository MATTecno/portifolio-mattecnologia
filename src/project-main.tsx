import { createRoot } from 'react-dom/client'
import { getProjectBySlug } from './data/projects'
import ProjectCasePage from './pages/ProjectCasePage'
import './styles.css'

const rootElement = document.getElementById('root')
const slug = rootElement?.dataset.projectSlug
const project = slug ? getProjectBySlug(slug) : undefined

if (!rootElement || !project) {
  throw new Error(`Case de projeto não encontrado: ${slug ?? 'slug ausente'}`)
}

createRoot(rootElement).render(<ProjectCasePage project={project} />)
