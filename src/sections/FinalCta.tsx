import WhatsAppCta from '../components/WhatsAppCta'
import { WHATSAPP_PROJECT_MESSAGE } from '../lib/contact'

type FinalCtaProps = {
  location: string
  message?: string
}

export default function FinalCta({ location, message = WHATSAPP_PROJECT_MESSAGE }: FinalCtaProps) {
  return (
    <section id="conversar" className="site-section final-cta-section">
      <div className="site-container final-cta-layout">
        <div>
          <p className="site-eyebrow">Vamos conversar</p>
          <h2>Tem um processo que poderia funcionar melhor?</h2>
          <p>
            Conte como sua empresa trabalha hoje e vamos avaliar como um sistema sob medida pode ajudar.
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
