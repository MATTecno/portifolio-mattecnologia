import WhatsAppCta from '../components/WhatsAppCta'
import { WHATSAPP_GENERAL_MESSAGE } from '../lib/contact'
import Sobre from './Sobre'

const STEPS = [
  ['Você conta o problema', 'Descreve como a empresa trabalha hoje e o que precisa funcionar melhor.'],
  ['Entendemos seu processo', 'Conversamos sobre quem usa, o que já existe e o que realmente precisa ser resolvido.'],
  ['Definimos a solução', 'Organizamos prioridades e o que faz sentido desenvolver neste momento.'],
  ['Você recebe uma proposta', 'O escopo, as entregas e as condições ficam registrados antes do início.'],
  ['Desenvolvemos e acompanhamos', 'O sistema é construído e a implantação é acompanhada conforme o combinado.'],
]

type ComoTrabalhoProps = {
  variant?: 'home' | 'landing'
  showAbout?: boolean
  ctaLocation?: string
  ctaMessage?: string
}

export default function ComoTrabalho({
  variant = 'home',
  showAbout = true,
  ctaLocation,
  ctaMessage = WHATSAPP_GENERAL_MESSAGE,
}: ComoTrabalhoProps) {
  return (
    <section id="processo" className="site-section site-container">
      <div className="section-heading">
        <p className="site-eyebrow">Como funciona</p>
        <h2>Do primeiro contato à entrega.</h2>
      </div>
      <ol className="process-steps">
        {(variant === 'landing' ? STEPS : [
          ['Você conta sua necessidade', 'Apresente sua empresa, seus serviços e o que pretende desenvolver.'],
          ['Entendemos seu objetivo', 'Conversamos sobre o público, o conteúdo e a rotina que o projeto precisa atender.'],
          ...STEPS.slice(2, 4),
          ['Desenvolvemos e acompanhamos', 'O projeto é desenvolvido e a publicação ou implantação é acompanhada conforme o combinado.'],
        ]).map(([title, description], index) => (
          <li key={title}>
            <span className="site-caption">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
      {ctaLocation && (
        <div className="site-actions process-cta">
          <WhatsAppCta
            location={ctaLocation}
            label="Quero conversar sobre meu projeto"
            message={ctaMessage}
            icon
          />
        </div>
      )}
      {showAbout && <Sobre />}
    </section>
  )
}
