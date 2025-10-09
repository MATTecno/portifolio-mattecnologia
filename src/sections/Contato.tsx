import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contato() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    // Validação simples
    const formEl = formRef.current!
    const name = (formEl.elements.namedItem('from_name') as HTMLInputElement)?.value?.trim()
    const email = (formEl.elements.namedItem('reply_to') as HTMLInputElement)?.value?.trim()
    const message = (formEl.elements.namedItem('message') as HTMLTextAreaElement)?.value?.trim()
    const bot = (formEl.elements.namedItem('website') as HTMLInputElement)?.value?.trim() // honeypot

    if (bot) {
      // Honeypot preenchido => provavelmente bot
      setStatus('error')
      setErrorMsg('Falha no envio. Tente novamente.')
      return
    }
    if (!name || !email || !message) {
      setStatus('error')
      setErrorMsg('Preencha nome, e-mail e mensagem.')
      return
    }

    try {
      // Opcional: adicionar o campo "site" para o template
      const siteField = formEl.elements.namedItem('site') as HTMLInputElement | null
      if (siteField) siteField.value = window.location.origin

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formEl, { publicKey: PUBLIC_KEY })
      setStatus('success')
      formEl.reset()
    } catch (err: any) {
      setStatus('error')
      setErrorMsg('Não foi possível enviar. Verifique sua conexão e tente novamente.')
      console.error(err)
    }
  }

  return (
    <section id="contato" className="relative scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 -z-10" />

      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-orbitron font-bold mb-6">Pronto para criar algo incrível?</h2>

        <form ref={formRef} onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Honeypot (campo escondido para bots) */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
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

          <div>
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

          <div>
            <label className="block text-sm opacity-80 mb-1" htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white/5 border border-white/10 rounded-mdplus px-4 py-3 outline-none focus:border-primary min-h-[140px]"
              placeholder="Conte, resumidamente, o que você precisa…"
              required
            />
          </div>

          {/* Campo extra "site" (preenchido no submit) */}
          <input type="hidden" name="site" />

          <button
            className="px-6 py-3 bg-primary rounded-mdplus shadow-glow font-medium disabled:opacity-60"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
          </button>

          {/* Mensagens de status (acessíveis) */}
          <p role="status" aria-live="polite" className="text-sm mt-2">
            {status === 'success' && 'Mensagem enviada! Vou te responder em breve.'}
            {status === 'error' && (errorMsg || 'Não foi possível enviar.')}
          </p>
        </form>

        <div className="mt-6 opacity-80 text-sm flex gap-4">
          <a href="https://wa.me/55SEUNUMERO?text=Ol%C3%A1%2C%20vim%20pelo%20site%20MATTecnologia" target="_blank" className="hover:opacity-100">WhatsApp</a>
          <a href="https://linkedin.com/in/seu-usuario" target="_blank" className="hover:opacity-100">LinkedIn</a>
          <a href="https://github.com/seu-usuario" target="_blank" className="hover:opacity-100">GitHub</a>
          <a href="mailto:contato@mattecnologia.com" className="hover:opacity-100">E-mail</a>
        </div>
      </div>
    </section>
  )
}
