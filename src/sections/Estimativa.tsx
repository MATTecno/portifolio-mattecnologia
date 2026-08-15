import { useMemo, useState } from 'react'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { trackContact } from '../lib/analytics'
import {
  calculateEstimate,
  DEFAULT_ESTIMATE_INPUT,
  FEATURE_CONFIG,
  formatBRL,
  formatEstimateSummary,
  PROJECT_CONFIG,
  SIZE_CONFIG,
  URGENCY_CONFIG,
  type ProjectFeature,
  type ProjectSize,
  type ProjectType,
  type ProjectUrgency,
} from '../lib/estimate'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'marcelos.diogo8@gmail.com'
const OWNER_WHATSAPP = (import.meta.env.VITE_OWNER_WHATSAPP || '5531995797235').replace(/\D/g, '')

export default function Estimativa() {
  const [project, setProject] = useState<ProjectType>(DEFAULT_ESTIMATE_INPUT.project)
  const [size, setSize] = useState<ProjectSize>(DEFAULT_ESTIMATE_INPUT.size)
  const [features, setFeatures] = useState<ProjectFeature[]>([...DEFAULT_ESTIMATE_INPUT.features])
  const [urgency, setUrgency] = useState<ProjectUrgency>(DEFAULT_ESTIMATE_INPUT.urgency)

  const input = useMemo(() => ({ project, size, features, urgency }), [project, size, features, urgency])
  const result = useMemo(() => calculateEstimate(input), [input])
  const summary = useMemo(() => formatEstimateSummary(input, result), [input, result])
  const whatsappHref = useMemo(() => {
    const message = encodeURIComponent(`${summary}\n\nQuero conversar sobre este projeto.`)
    return `https://wa.me/${OWNER_WHATSAPP}?text=${message}`
  }, [summary])
  const emailHref = useMemo(() => {
    const subject = encodeURIComponent('Estimativa de projeto — MATTecnologia')
    const body = encodeURIComponent(`${summary}\n\nOlá, gostaria de conversar sobre esta estimativa.`)
    return `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`
  }, [summary])

  function toggleFeature(feature: ProjectFeature) {
    setFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    )
  }

  return (
    <section id="estimativa" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-3xl mb-10">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">Estimativa inicial</p>
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold">Tenha uma primeira faixa em poucos cliques</h2>
        <p className="opacity-75 mt-4 leading-relaxed">
          Escolha o formato mais próximo da sua ideia. O resultado ajuda a iniciar a conversa e será refinado depois de
          entendermos o escopo.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)] gap-7 items-start">
        <div className="p-5 md:p-7 rounded-2xl border border-white/10 bg-white/[0.035] space-y-7">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="estimate-project">1. Tipo de projeto</label>
              <select
                id="estimate-project"
                value={project}
                onChange={(event) => setProject(event.target.value as ProjectType)}
                className="w-full bg-[#17171d] border border-white/15 rounded-lg px-4 py-3 outline-none focus:border-primary"
              >
                {Object.entries(PROJECT_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" htmlFor="estimate-size">2. Tamanho aproximado</label>
              <select
                id="estimate-size"
                value={size}
                onChange={(event) => setSize(event.target.value as ProjectSize)}
                className="w-full bg-[#17171d] border border-white/15 rounded-lg px-4 py-3 outline-none focus:border-primary"
              >
                {Object.entries(SIZE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>{config.label} · {config.detail}</option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold mb-3">3. Recursos que precisa</legend>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {Object.entries(FEATURE_CONFIG).map(([value, config]) => {
                const feature = value as ProjectFeature
                const checked = features.includes(feature)

                return (
                  <label
                    key={feature}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                      checked
                        ? 'border-primary/60 bg-primary/10'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/25'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFeature(feature)}
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm">{config.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold mb-3">4. Urgência</legend>
            <div className="grid sm:grid-cols-3 gap-3">
              {Object.entries(URGENCY_CONFIG).map(([value, config]) => {
                const urgencyValue = value as ProjectUrgency
                const checked = urgency === urgencyValue

                return (
                  <label
                    key={urgencyValue}
                    className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition ${
                      checked
                        ? 'border-secondary/60 bg-secondary/10'
                        : 'border-white/10 bg-white/[0.025] hover:border-white/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={urgencyValue}
                      checked={checked}
                      onChange={() => setUrgency(urgencyValue)}
                      className="size-4 accent-secondary"
                    />
                    <span className="text-sm">{config.label}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-24 p-6 md:p-7 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 to-secondary/10 shadow-glow">
          <p className="text-sm opacity-70">Faixa estimada</p>
          <p className="mt-2 text-3xl font-bold" aria-live="polite">
            {formatBRL(result.price[0])}
            <span className="block text-base font-normal opacity-60 my-1">até</span>
            {formatBRL(result.price[1])}
          </p>
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-sm opacity-65">Prazo aproximado</p>
            <p className="text-xl font-semibold mt-1">{result.scheduleDays[0]}–{result.scheduleDays[1]} dias</p>
          </div>
          <p className="text-xs opacity-60 leading-relaxed mt-5">
            Estimativa inicial, sem compromisso. O valor final depende da validação das regras, integrações e materiais do projeto.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('whatsapp', 'commercial_estimate')}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary rounded-mdplus shadow-glow font-medium hover:brightness-110 transition"
            >
              <FaWhatsapp aria-hidden="true" />
              Conversar no WhatsApp
            </a>
            <a
              href={emailHref}
              onClick={() => trackContact('email', 'commercial_estimate')}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-white/15 rounded-mdplus hover:bg-white/5 transition"
            >
              <FaEnvelope aria-hidden="true" />
              Enviar por e-mail
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
