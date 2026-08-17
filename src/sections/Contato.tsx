import { useRef, useState } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaSpinner } from 'react-icons/fa'
import {
  trackContact,
  trackContactFormSubmitted,
  trackProfile,
} from '../lib/analytics'

function getSendErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'text' in error && typeof error.text === 'string') {
    if (/invalid grant|reconnect/i.test(error.text)) {
      return 'O envio pelo formulário está temporariamente indisponível. Fale comigo pelo WhatsApp ou e-mail.'
    }
  }

  return 'Não foi possível enviar agora. Verifique sua conexão ou use um dos canais alternativos.'
}

export default function Contato() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')

    const formEl = e.currentTarget
    const name = (formEl.elements.namedItem('from_name') as HTMLInputElement)?.value?.trim()
    const email = (formEl.elements.namedItem('reply_to') as HTMLInputElement)?.value?.trim()
    const message = (formEl.elements.namedItem('message') as HTMLTextAreaElement)?.value?.trim()
    const honeypot = (formEl.elements.namedItem('website') as HTMLInputElement)?.value?.trim()

    if (honeypot) {
      setStatus('error')
      setErrorMsg('Falha no envio. Tente novamente.')
      return
    }
    if (!name || !email || !message) {
      setStatus('error')
      setErrorMsg('Preencha nome, e-mail e mensagem.')
      return
    }
    if (!(formEl.elements.namedItem('reply_to') as HTMLInputElement).validity.valid) {
      setStatus('error')
      setErrorMsg('Informe um endereço de e-mail válido.')
      return
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus('error')
      setErrorMsg('O formulário ainda não está configurado. Entre em contato pelo WhatsApp ou e-mail.')
      return
    }

    setStatus('sending')
    try {
      const { default: emailjs } = await import('@emailjs/browser')
      const siteField = formEl.elements.namedItem('site') as HTMLInputElement | null
      if (siteField) siteField.value = window.location.origin

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formEl, { publicKey: PUBLIC_KEY })
      trackContactFormSubmitted('commercial_contact_form')
      setStatus('success')
      formEl.reset()
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(getSendErrorMessage(err))
      console.error(err)
    }
  }

  return (
    <section id="contato" className="relative scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 -z-10" />

      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">Vamos conversar</p>
        <h2 className="text-3xl font-orbitron font-bold mb-3">Conte o que você quer tirar do papel</h2>
        <p className="opacity-75 mb-7">Pode ser uma ideia nova ou uma operação que precisa funcionar melhor.</p>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          onChange={() => {
            if (status !== 'idle' && status !== 'sending') {
              setStatus('idle')
              setErrorMsg('')
            }
          }}
          className="space-y-4"
          noValidate
        >
          <input type="text" name="website" className="ph-no-capture hidden" tabIndex={-1} autoComplete="off" />

          <div className="ph-mask">
            <label className="block text-sm opacity-80 mb-1" htmlFor="from_name">Nome</label>
            <input
              id="from_name"
              name="from_name"
              className="w-full bg-white/5 border border-white/10 rounded-mdplus px-4 py-3 outline-none focus:border-primary"
              placeholder="Seu nome"
              autoComplete="name"
              required
            />
          </div>

          <div className="ph-mask">
            <label className="block text-sm opacity-80 mb-1" htmlFor="reply_to">E-mail</label>
            <input
              id="reply_to"
              name="reply_to"
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-mdplus px-4 py-3 outline-none focus:border-primary"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="ph-mask">
            <label className="block text-sm opacity-80 mb-1" htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white/5 border border-white/10 rounded-mdplus px-4 py-3 outline-none focus:border-primary min-h-[140px]"
              placeholder="Conte, resumidamente, o que você precisa…"
              required
            />
          </div>

          <input type="hidden" name="site" className="ph-no-capture" />

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-mdplus bg-primary px-6 py-3 font-semibold shadow-glow transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? (
              <>
                <FaSpinner className="animate-spin" aria-hidden="true" />
                Enviando mensagem…
              </>
            ) : (
              <>
                <FaPaperPlane aria-hidden="true" />
                Enviar mensagem
              </>
            )}
          </button>

          {status !== 'idle' && (
            <div
              id="contact-feedback"
              role={status === 'error' ? 'alert' : 'status'}
              aria-live={status === 'error' ? 'assertive' : 'polite'}
              aria-atomic="true"
              className={`rounded-xl border p-4 shadow-lg ${
                status === 'success'
                  ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-50'
                  : status === 'error'
                    ? 'border-red-400/40 bg-red-400/10 text-red-50'
                    : 'border-primary/40 bg-primary/10 text-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${
                    status === 'success'
                      ? 'bg-emerald-400/20 text-emerald-300'
                      : status === 'error'
                        ? 'bg-red-400/20 text-red-300'
                        : 'bg-primary/20 text-primary'
                  }`}
                  aria-hidden="true"
                >
                  {status === 'success' ? (
                    <FaCheckCircle />
                  ) : status === 'error' ? (
                    <FaExclamationCircle />
                  ) : (
                    <FaSpinner className="animate-spin" />
                  )}
                </span>

                <div>
                  <p className="font-semibold">
                    {status === 'success'
                      ? 'Mensagem enviada com sucesso!'
                      : status === 'error'
                        ? 'Não foi possível enviar'
                        : 'Enviando sua mensagem'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed opacity-85">
                    {status === 'success'
                      ? 'Recebi seus dados e responderei pelo e-mail informado assim que possível.'
                      : status === 'error'
                        ? errorMsg || 'Tente novamente ou use um dos canais alternativos.'
                        : 'Aguarde alguns segundos enquanto concluo o envio.'}
                  </p>
                </div>
              </div>

              {status === 'error' && (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-red-200/15 pt-3 text-sm font-semibold">
                  <a
                    href="https://wa.me/5531995797235?text=Ol%C3%A1%2C%20tentei%20enviar%20uma%20mensagem%20pelo%20site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-red-100/10 px-3 py-2 text-red-50 transition hover:bg-red-100/20"
                    onClick={() => trackContact('whatsapp', 'commercial_contact_error')}
                  >
                    Falar pelo WhatsApp
                  </a>
                  <a
                    href="mailto:marcelos.diogo8@gmail.com"
                    className="rounded-md bg-red-100/10 px-3 py-2 text-red-50 transition hover:bg-red-100/20"
                    onClick={() => trackContact('email', 'commercial_contact_error')}
                  >
                    Enviar e-mail
                  </a>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="mt-6 opacity-80 text-sm flex gap-4">
          <a
            href="https://wa.me/5531995797235?text=Ol%C3%A1%2C%20vim%20pelo%20site%20MATTecnologia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100"
            onClick={() => trackContact('whatsapp', 'commercial_contact')}
          >WhatsApp</a>
          <a
            href="https://github.com/mattecno"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100"
            onClick={() => trackProfile('github', 'commercial_contact')}
          >GitHub</a>
          <a
            href="mailto:marcelos.diogo8@gmail.com"
            className="hover:opacity-100"
            onClick={() => trackContact('email', 'commercial_contact')}
          >E-mail</a>
        </div>
      </div>
    </section>
  )
}
