import { useState } from 'react'
import CommercialHeader from '../components/CommercialHeader'
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton'
import Hero from '../sections/Hero'
import Problemas from '../sections/Problemas'
import Servicos from '../sections/Servicos'
import Projetos from '../sections/Projetos'
import Contato from '../sections/Contato'
import Rodape from '../sections/Rodape'
import Estimativa from '../sections/Estimativa'
import ComoTrabalho from '../sections/ComoTrabalho'
import Diferencial from '../sections/Diferencial'
import FAQ from '../sections/FAQ'
import FinalCta from '../sections/FinalCta'
import { EMPTY_BRIEFING, type ProjectBriefing, type ProjectReference } from '../lib/estimate'

export default function App({ initialReference }: { initialReference?: ProjectReference }) {
  const [briefing, setBriefing] = useState<ProjectBriefing>({ ...EMPTY_BRIEFING, features: [] })
  const [includeBriefing, setIncludeBriefing] = useState(false)
  const [reference, setReference] = useState(initialReference)
  return (
    <div className="commercial-theme commercial-page">
      <CommercialHeader home />
      <main id="conteudo">
        <Hero />
        <Problemas />
        <Servicos />
        <ComoTrabalho ctaLocation="commercial_process" />
        <Diferencial />
        <Projetos />
        <Estimativa
          value={briefing}
          onChange={setBriefing}
          reference={reference}
          onContinue={() => setIncludeBriefing(true)}
        />
        <FAQ />
        <FinalCta location="commercial_final_cta" />
        <Contato
          briefing={includeBriefing ? briefing : undefined}
          reference={reference}
          onRemoveReference={() => setReference(undefined)}
          onRemoveBriefing={() => setIncludeBriefing(false)}
        />
      </main>
      <Rodape />
      <WhatsAppFloatingButton />
    </div>
  )
}
