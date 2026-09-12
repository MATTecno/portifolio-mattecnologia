import { useState } from 'react'
import {
  composeContactMessage,
  formatBriefing,
  validateBriefing,
  type ProjectBriefing,
  type ProjectReference,
} from '../lib/estimate'
import { emailLink, whatsappLink } from '../lib/contact'
import { trackContact, trackContactFormSubmitted, type ContactChannel } from '../lib/analytics'

type Props = {
  briefing?: ProjectBriefing
  reference?: ProjectReference
  onRemoveReference: () => void
  onRemoveBriefing: () => void
}

export default function Contato({ briefing, reference, onRemoveReference, onRemoveBriefing }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const combinedMessage = composeContactMessage(
    message || 'Olá, gostaria de conversar sobre um projeto.',
    briefing,
    reference,
  )
  function openChannel(
    event: React.MouseEvent<HTMLAnchorElement>,
    channel: ContactChannel,
    location: string,
  ) {
    const briefingError = briefing ? validateBriefing(briefing) : null
    if (briefingError) {
      event.preventDefault()
      setStatus('error')
      setError(briefingError)
      return
    }
    trackContact(channel, location)
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    const briefingError = briefing ? validateBriefing(briefing) : null
    if (briefingError) {
      setStatus('error')
      setError(briefingError)
      return
    }
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement).value
    if (honeypot) {
      setStatus('error')
      setError('Não foi possível enviar. Tente um dos canais de contato.')
      return
    }
    if (
      !name.trim() ||
      !email.trim() ||
      (!message.trim() && !briefing && !reference) ||
      !(form.elements.namedItem('reply_to') as HTMLInputElement).validity.valid
    ) {
      setStatus('error')
      setError('Informe seu nome, um e-mail válido e uma mensagem ou resumo do projeto.')
      return
    }
    const service = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (!service || !template || !key) {
      setStatus('error')
      setError(
        'O formulário está indisponível no momento. Você pode enviar o mesmo contexto pelo WhatsApp ou e-mail.',
      )
      return
    }
    setStatus('sending')
    try {
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(
        service,
        template,
        {
          from_name: name.trim(),
          reply_to: email.trim(),
          message: combinedMessage,
          site: window.location.origin,
        },
        { publicKey: key },
      )
      trackContactFormSubmitted('commercial_contact_form')
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      onRemoveBriefing()
      onRemoveReference()
    } catch {
      setStatus('error')
      setError(
        'Não foi possível enviar agora. Seus dados continuam preenchidos. Tente novamente ou use WhatsApp ou e-mail.',
      )
    }
  }
  return (
    <section id="contato" className="site-section site-container contact-layout">
      <div className="section-heading">
        <p className="site-eyebrow">Contato</p>
        <h2>Vamos conversar sobre o que você precisa?</h2>
        <p>Conte um pouco da situação. Marcelo responde pelo e-mail informado para continuar a conversa.</p>
        <div className="site-actions">
          <a
            className="site-text-link ph-no-capture"
            href={whatsappLink(combinedMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => openChannel(event, 'whatsapp', 'commercial_contact')}
          >
            WhatsApp ↗
          </a>
          <a
            className="site-text-link ph-no-capture"
            href={emailLink(combinedMessage)}
            onClick={(event) => openChannel(event, 'email', 'commercial_contact')}
          >
            E-mail ↗
          </a>
        </div>
      </div>
      <div>
        {reference && (
          <div className="contact-context">
            <div>
              <p className="site-caption">Projeto de referência</p>
              <p>
                <strong>{reference.title}</strong>
              </p>
            </div>
            <button type="button" className="site-subtle-link" onClick={onRemoveReference}>
              Remover referência
            </button>
          </div>
        )}
        {briefing && (
          <div className="contact-context ph-mask">
            <details>
              <summary>Resumo do projeto incluído</summary>
              <p className="briefing-preview">{formatBriefing(briefing)}</p>
            </details>
            <button type="button" className="site-subtle-link" onClick={onRemoveBriefing}>
              Remover resumo
            </button>
          </div>
        )}
        <form
          onSubmit={submit}
          noValidate
          onChange={() => {
            if (status !== 'sending') setStatus('idle')
          }}
          className="contact-form"
        >
          <input
            type="text"
            name="website"
            className="ph-no-capture hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="ph-mask">
            <label htmlFor="contact-name">Nome</label>
            <input
              id="contact-name"
              name="from_name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
            />
          </div>
          <div className="ph-mask">
            <label htmlFor="contact-email">E-mail</label>
            <input
              id="contact-email"
              name="reply_to"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={254}
            />
          </div>
          <div className="ph-mask">
            <label htmlFor="contact-message">
              {briefing || reference ? 'Quer acrescentar alguma coisa? (opcional)' : 'Mensagem'}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required={!briefing && !reference}
              maxLength={5000}
              placeholder="Conte o que você precisa ou deixe uma dúvida."
            />
          </div>
          <button
            className="site-button"
            type="submit"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Enviando mensagem…' : 'Enviar mensagem'}
          </button>
          <p className="site-caption">
            Os dados são usados para responder ao contato.{' '}
            <a className="site-text-link" href="/privacidade/">
              Leia a política de privacidade.
            </a>
          </p>
          {status === 'success' && (
            <p className="site-feedback" role="status">
              Mensagem enviada. Responderei pelo e-mail informado.
            </p>
          )}
          {status === 'error' && (
            <div className="site-feedback is-error" role="alert">
              <p>{error}</p>
              <div className="site-actions ph-no-capture">
                <a
                  href={whatsappLink(combinedMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => openChannel(event, 'whatsapp', 'commercial_contact_error')}
                >
                  Enviar pelo WhatsApp ↗
                </a>
                <a
                  href={emailLink(combinedMessage)}
                  onClick={(event) => openChannel(event, 'email', 'commercial_contact_error')}
                >
                  Enviar por e-mail ↗
                </a>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
