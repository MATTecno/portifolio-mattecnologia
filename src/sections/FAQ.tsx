import { HOME_FAQ, SUPPORTING_FAQ, type FaqItem } from '../data/faq'
import { trackFaqInteraction } from '../lib/analytics'

type FAQProps = {
  items?: FaqItem[]
}

export default function FAQ({ items }: FAQProps) {
  const questions = items ?? [...HOME_FAQ, ...SUPPORTING_FAQ]
  return (
    <section id="perguntas" className="site-section faq-section">
      <div className="site-container faq-layout">
        <div className="section-heading">
          <p className="site-eyebrow">Antes de começar</p>
          <h2>Perguntas frequentes.</h2>
        </div>
        <div>
          {questions.map((item) => (
            <details
              key={item.id}
              onToggle={(event) =>
                trackFaqInteraction(item.id, event.currentTarget.open ? 'open' : 'closed')
              }
            >
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
