import { useState } from 'react'
import CommercialHeader from '../components/CommercialHeader'
import Hero from '../sections/Hero'
import Servicos from '../sections/Servicos'
import Projetos from '../sections/Projetos'
import Contato from '../sections/Contato'
import Rodape from '../sections/Rodape'
import Estimativa from '../sections/Estimativa'
import ComoTrabalho from '../sections/ComoTrabalho'
import FAQ from '../sections/FAQ'
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
        <Projetos />
        <Servicos />
        <ComoTrabalho />
        <Estimativa
          value={briefing}
          onChange={setBriefing}
          reference={reference}
          onContinue={() => setIncludeBriefing(true)}
        />
        <FAQ />
        <Contato
          briefing={includeBriefing ? briefing : undefined}
          reference={reference}
          onRemoveReference={() => setReference(undefined)}
          onRemoveBriefing={() => setIncludeBriefing(false)}
        />
      </main>
      <Rodape />
    </div>
  )
}
