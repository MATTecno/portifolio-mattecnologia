import WhatsAppCta from '../components/WhatsAppCta'
import { WHATSAPP_GENERAL_MESSAGE } from '../lib/contact'

type FinalCtaProps = {
  variant?: 'home' | 'landing'
  location: string
  message?: string
}

export default function FinalCta({ variant = 'home', location, message = WHATSAPP_GENERAL_MESSAGE }: FinalCtaProps) {
  return (
    <section id="conversar" className="site-section final-cta-section">
      <div className="site-container final-cta-layout">
        <div>
          <p className="site-eyebrow">Vamos conversar</p>
          <h2>{variant === 'landing' ? 'Tem um processo que poderia funcionar melhor?' : 'Vamos conversar sobre o projeto da sua empresa?'}</h2>
          <p>
            {variant === 'landing' ? 'Conte como sua empresa trabalha hoje e vamos avaliar como um sistema sob medida pode ajudar.' : 'Uma landing page, um site ou um sistema: conte o que você precisa e vamos definir juntos o escopo da proposta.'}
          </p>
        </div>
        <div className="final-cta-actions">
          <WhatsAppCta location={location} label="Conversar pelo WhatsApp" message={message} icon />
          <p className="site-caption">Primeiro contato sem compromisso.</p>
        </div>
      </div>
    </section>
  )
}
