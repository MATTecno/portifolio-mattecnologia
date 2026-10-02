import { useRef } from 'react'
import MatHeader from '../components/editorial/MatHeader'
import MatFooter from '../components/editorial/MatFooter'
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton'
import EditorialHero from '../sections/editorial/EditorialHero'
import EditorialServices from '../sections/editorial/EditorialServices'
import ChaosStory from '../sections/editorial/ChaosStory'
import SelectedProjects from '../sections/editorial/SelectedProjects'
import {
  EditorialProcess,
  EditorialAbout,
  EditorialCta,
} from '../sections/editorial/EditorialClosing'
import FAQ from '../sections/FAQ'
import { EDITORIAL_FAQ } from '../data/home'
import { useEditorialMotion } from '../lib/useEditorialMotion'
import { WHATSAPP_CONTEXT_MESSAGES } from '../lib/contact'
import type { ProjectReference } from '../lib/estimate'

export default function App({ initialReference }: { initialReference?: ProjectReference }) {
  const root = useRef<HTMLDivElement>(null)
  useEditorialMotion(root)
  return (
    <div className="commercial-theme mat-page" ref={root}>
      <MatHeader home />
      <main id="conteudo">
        <EditorialHero />
        <EditorialServices />
        <ChaosStory />
        <SelectedProjects />
        <EditorialProcess />
        <EditorialAbout />
        <EditorialCta reference={initialReference} />
        <FAQ items={EDITORIAL_FAQ} />
      </main>
      <MatFooter />
      <WhatsAppFloatingButton message={WHATSAPP_CONTEXT_MESSAGES.hero} />
    </div>
  )
}
