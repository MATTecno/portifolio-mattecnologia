import { useRef, useState } from 'react'
import {
  FEATURE_OPTIONS,
  PROJECT_OPTIONS,
  composeContactMessage,
  formatBriefing,
  validateBriefing,
  type ProjectBriefing,
  type ProjectReference,
} from '../lib/estimate'
import { emailLink, whatsappLink } from '../lib/contact'
import { trackBriefing, trackContact } from '../lib/analytics'

type Props = {
  value: ProjectBriefing
  onChange: (value: ProjectBriefing) => void
  onContinue: () => void
  reference?: ProjectReference
}

export default function Estimativa({ value, onChange, onContinue, reference }: Props) {
  const started = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const message = composeContactMessage('Olá, gostaria de conversar sobre este projeto.', value, reference)
  function update(next: ProjectBriefing) {
    if (!started.current) {
      trackBriefing('started')
      started.current = true
    }
    setError(null)
    onChange(next)
  }
  function complete() {
    const problem = validateBriefing(value)
    setError(problem)
    if (problem) return false
    if (!started.current) {
      trackBriefing('started')
      started.current = true
    }
    trackBriefing('completed')
    return true
  }
  return (
    <section id="estimativa" className="site-section site-container">
      <div className="section-heading">
        <p className="site-eyebrow">Seu projeto</p>
        <h2>Conte sobre seu projeto.</h2>
        <p>
          Preencha o que souber. O resumo ajuda a iniciar a conversa; valores e prazos são definidos depois de
          entender o escopo.
        </p>
      </div>
      <div className="briefing-layout">
        <div className="briefing-fields ph-mask">
          <label htmlFor="briefing-type">O que você precisa?</label>
          <select
            id="briefing-type"
            value={value.project}
            onChange={(e) => update({ ...value, project: e.target.value as ProjectBriefing['project'] })}
          >
            {Object.entries(PROJECT_OPTIONS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <label htmlFor="briefing-description">
            Qual problema você quer resolver? <span className="field-optional">Opcional</span>
          </label>
          <textarea
            id="briefing-description"
            maxLength={2000}
            rows={4}
            value={value.description}
            onChange={(e) => update({ ...value, description: e.target.value })}
            placeholder="Por exemplo: hoje controlo o estoque em planilhas e preciso acompanhar as entradas e saídas."
          />
          <fieldset>
            <legend>
              Recursos que você já sabe que precisa <span className="field-optional">Opcional</span>
            </legend>
            <div className="feature-options">
              {Object.entries(FEATURE_OPTIONS).map(([id, label]) => {
                const feature = id as ProjectBriefing['features'][number]
                return (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={value.features.includes(feature)}
                      onChange={(e) =>
                        update({
                          ...value,
                          features: e.target.checked
                            ? [...value.features, feature]
                            : value.features.filter((item) => item !== feature),
                        })
                      }
                    />
                    {label}
                  </label>
                )
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend>Existe uma data desejada?</legend>
            <div className="deadline-options">
              <label>
                <input
                  type="radio"
                  name="deadline"
                  checked={value.deadline === 'undefined'}
                  onChange={() => update({ ...value, deadline: 'undefined', desiredDate: '' })}
                />
                Sem data definida
              </label>
              <label>
                <input
                  type="radio"
                  name="deadline"
                  checked={value.deadline === 'date'}
                  onChange={() => update({ ...value, deadline: 'date' })}
                />
                Quero informar uma data
              </label>
            </div>
            {value.deadline === 'date' && (
              <div className="date-field">
                <label htmlFor="briefing-date">Data desejada</label>
                <input
                  id="briefing-date"
                  type="date"
                  value={value.desiredDate}
                  aria-describedby="deadline-note"
                  aria-invalid={Boolean(error)}
                  onChange={(e) => update({ ...value, desiredDate: e.target.value })}
                />
                <p id="deadline-note" className="site-caption">
                  É uma preferência, sujeita à análise do escopo e da disponibilidade.
                </p>
              </div>
            )}
          </fieldset>
          {error && (
            <p className="site-feedback is-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <aside className="briefing-summary">
          <p className="site-eyebrow">O ponto de partida</p>
          <h3>Resumo para a conversa</h3>
          <p className="briefing-preview ph-mask">{formatBriefing(value)}</p>
          <div className="site-actions vertical-actions ph-no-capture">
            <a
              className="site-button"
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!complete()) e.preventDefault()
                else trackContact('whatsapp', 'commercial_briefing')
              }}
            >
              Conversar pelo WhatsApp ↗
            </a>
            <a
              className="site-button site-button-secondary"
              href="#contato"
              onClick={(e) => {
                if (!complete()) e.preventDefault()
                else onContinue()
              }}
            >
              Continuar no formulário
            </a>
            <a
              className="site-text-link"
              href={emailLink(message)}
              onClick={(e) => {
                if (!complete()) e.preventDefault()
                else trackContact('email', 'commercial_briefing')
              }}
            >
              Enviar por e-mail
            </a>
          </div>
          <p className="site-caption">Você também pode entrar em contato sem preencher este resumo.</p>
        </aside>
      </div>
    </section>
  )
}
