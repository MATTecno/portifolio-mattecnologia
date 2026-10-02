import { useState } from 'react'
import MatHeader from '../components/editorial/MatHeader'
import MatFooter from '../components/editorial/MatFooter'
import Estimativa from '../sections/Estimativa'
import Contato from '../sections/Contato'
import FAQ from '../sections/FAQ'
import { EMPTY_BRIEFING, type ProjectBriefing, type ProjectReference } from '../lib/estimate'

export default function ContactPage({ initialReference }: { initialReference?: ProjectReference }) {
  const [briefing, setBriefing] = useState<ProjectBriefing>({ ...EMPTY_BRIEFING, features: [] })
  const [includeBriefing, setIncludeBriefing] = useState(false)
  const [reference, setReference] = useState(initialReference)
  return (
    <div className="commercial-theme mat-page mat-contact-page">
      <MatHeader />
      <main id="conteudo">
        <div className="mat-wrap mat-internal-intro">
          <a className="mat-text-link" href="/">
            ← Voltar à MAT
          </a>
          <p className="mat-label">Uma conversa é um bom começo</p>
          <h1>
            Conte o que precisa
            <br />
            ficar mais simples.
          </h1>
          <p>
            Você pode escrever uma mensagem ou preparar um breve resumo do projeto. O escopo e a
            proposta vêm depois da conversa.
          </p>
        </div>
        <Estimativa
          value={briefing}
          onChange={setBriefing}
          reference={reference}
          onContinue={() => setIncludeBriefing(true)}
        />
        <Contato
          briefing={includeBriefing ? briefing : undefined}
          reference={reference}
          onRemoveReference={() => setReference(undefined)}
          onRemoveBriefing={() => setIncludeBriefing(false)}
        />
        <FAQ />
      </main>
      <MatFooter />
    </div>
  )
}
