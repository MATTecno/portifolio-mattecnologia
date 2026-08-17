import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CONSENT_DURATION_DAYS,
  PRIVACY_PREFERENCES_OPEN_EVENT,
  getConsentPreferences,
  saveConsentPreferences,
  type ConsentChoice,
  type ConsentPreferences,
} from '../lib/consent'

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function browserUsesDoNotTrack(): boolean {
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'
}

export type PrivacyControlsTheme = 'default' | 'recruiter'

type PrivacyControlsProps = {
  theme?: PrivacyControlsTheme
}

export default function PrivacyControls({ theme = 'default' }: PrivacyControlsProps) {
  const recruiterTheme = theme === 'recruiter'
  const initialPreferences = useMemo(() => getConsentPreferences(), [])
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(initialPreferences)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState<ConsentChoice>(() => ({
    analytics: initialPreferences?.analytics ?? false,
    replay: initialPreferences?.replay ?? false,
  }))
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const showBanner = !preferences && !dialogOpen

  function openDialog() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    setDraft({
      analytics: preferences?.analytics ?? false,
      replay: preferences?.replay ?? false,
    })
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    globalThis.setTimeout(() => previousFocusRef.current?.focus(), 0)
  }

  function persist(choice: ConsentChoice) {
    const saved = saveConsentPreferences(choice)
    setPreferences(saved)
    setDialogOpen(false)
  }

  useEffect(() => {
    const handleOpen = () => openDialog()
    window.addEventListener(PRIVACY_PREFERENCES_OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(PRIVACY_PREFERENCES_OPEN_EVENT, handleOpen)
  })

  useEffect(() => {
    if (!dialogOpen) return
    const dialog = dialogRef.current
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    focusable?.[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDialog()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const controls = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      if (controls.length === 0) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dialogOpen])

  return (
    <>
      {showBanner && (
        <section
          aria-labelledby="cookie-banner-title"
          className={`fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-6xl rounded-2xl border p-5 shadow-2xl sm:inset-x-6 sm:p-6 ${
            recruiterTheme
              ? 'border-slate-200 bg-white text-slate-900 shadow-slate-900/15'
              : 'border-white/15 bg-slate-950 text-white'
          }`}
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <h2
                id="cookie-banner-title"
                className={recruiterTheme ? 'text-lg font-bold tracking-tight' : 'font-orbitron text-lg font-bold'}
              >
                Sua privacidade, sua escolha
              </h2>
              <p className={`mt-2 text-sm leading-relaxed ${recruiterTheme ? 'text-slate-600' : 'text-slate-300'}`}>
                Cookies opcionais ajudam a entender o uso do site, receber feedback e, se você permitir,
                gravar a navegação com campos sensíveis mascarados. A recusa não limita o site.
              </p>
              <a
                href="/privacidade/"
                className={`mt-2 inline-block text-sm font-medium underline-offset-4 hover:underline ${
                  recruiterTheme ? 'text-blue-700' : 'text-primary'
                }`}
              >
                Saiba como os dados são tratados
              </a>
            </div>
            <div className="grid shrink-0 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => persist({ analytics: true, replay: true })}
                className={`rounded-mdplus px-4 py-2.5 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  recruiterTheme
                    ? 'bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-700'
                    : 'bg-primary text-slate-950 hover:brightness-110 focus-visible:outline-primary'
                }`}
              >
                Aceitar todos
              </button>
              <button
                type="button"
                onClick={() => persist({ analytics: false, replay: false })}
                className={`rounded-mdplus border px-4 py-2.5 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  recruiterTheme
                    ? 'border-slate-300 text-slate-800 hover:bg-slate-100 focus-visible:outline-blue-700'
                    : 'border-white/30 text-white hover:bg-white/10 focus-visible:outline-white'
                }`}
              >
                Rejeitar não essenciais
              </button>
              <button
                type="button"
                onClick={openDialog}
                className={`rounded-mdplus border px-4 py-2.5 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  recruiterTheme
                    ? 'border-slate-300 text-slate-800 hover:bg-slate-100 focus-visible:outline-blue-700'
                    : 'border-white/30 text-white hover:bg-white/10 focus-visible:outline-white'
                }`}
              >
                Personalizar
              </button>
            </div>
          </div>
        </section>
      )}

      {dialogOpen && (
        <div
          className={`fixed inset-0 z-[110] grid place-items-center overflow-y-auto p-4 backdrop-blur-sm ${
            recruiterTheme ? 'bg-slate-950/55' : 'bg-slate-950/85'
          }`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog()
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-settings-title"
            aria-describedby="privacy-settings-description"
            className={`my-auto w-full max-w-3xl rounded-2xl border p-5 shadow-2xl sm:p-7 ${
              recruiterTheme
                ? 'border-slate-200 bg-white text-slate-900 shadow-slate-950/20'
                : 'border-white/15 bg-[#111117] text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="privacy-settings-title"
                  className={recruiterTheme ? 'text-xl font-bold tracking-tight sm:text-2xl' : 'font-orbitron text-xl font-bold sm:text-2xl'}
                >
                  Preferências de privacidade
                </h2>
                <p
                  id="privacy-settings-description"
                  className={`mt-2 text-sm leading-relaxed ${recruiterTheme ? 'text-slate-600' : 'text-slate-300'}`}
                >
                  Escolha as finalidades opcionais. Você pode alterar esta decisão a qualquer momento.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Fechar preferências"
                className={`grid size-10 shrink-0 place-items-center rounded-full border text-xl transition ${
                  recruiterTheme ? 'border-slate-300 hover:bg-slate-100' : 'border-white/20 hover:bg-white/10'
                }`}
              >
                ×
              </button>
            </div>

            {browserUsesDoNotTrack() && (
              <p className={`mt-5 rounded-xl border p-3 text-sm ${
                recruiterTheme
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-amber-300/30 bg-amber-300/10 text-amber-100'
              }`}>
                O navegador está com “Não rastrear” ativo. Esse sinal prevalece mesmo que uma categoria seja aceita.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <div className={`rounded-xl border p-4 ${
                recruiterTheme ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.035]'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">Cookies necessários</h3>
                    <p className={`mt-1 text-sm leading-relaxed ${recruiterTheme ? 'text-slate-600' : 'text-slate-300'}`}>
                      Guardam sua escolha por {CONSENT_DURATION_DAYS} dias e mantêm funções básicas do site.
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    recruiterTheme ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-400/15 text-emerald-200'
                  }`}>
                    Sempre ativos
                  </span>
                </div>
              </div>

              <label className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 ${
                recruiterTheme ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.035]'
              }`}>
                <span>
                  <span className="block font-semibold">Métricas e feedback</span>
                  <span className={`mt-1 block text-sm leading-relaxed ${recruiterTheme ? 'text-slate-600' : 'text-slate-300'}`}>
                    Mede páginas e ações por meio de um identificador anônimo e habilita o botão opcional de feedback.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(event) => setDraft({
                    analytics: event.target.checked,
                    replay: event.target.checked ? draft.replay : false,
                  })}
                  className={`mt-1 size-5 shrink-0 ${recruiterTheme ? 'accent-blue-700' : 'accent-primary'}`}
                />
              </label>

              <label className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${
                recruiterTheme ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-white/[0.035]'
              } ${draft.analytics ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                <span>
                  <span className="block font-semibold">Gravações de sessão</span>
                  <span className={`mt-1 block text-sm leading-relaxed ${recruiterTheme ? 'text-slate-600' : 'text-slate-300'}`}>
                    Reproduz a navegação para encontrar dificuldades. Campos de formulário são mascarados.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={draft.replay}
                  disabled={!draft.analytics}
                  onChange={(event) => setDraft({ analytics: true, replay: event.target.checked })}
                  className={`mt-1 size-5 shrink-0 ${recruiterTheme ? 'accent-blue-700' : 'accent-primary'}`}
                />
              </label>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => persist(draft)}
                className={`rounded-mdplus px-4 py-2.5 font-semibold transition ${
                  recruiterTheme ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-primary text-slate-950 hover:brightness-110'
                }`}
              >
                Salvar preferências
              </button>
              <button
                type="button"
                onClick={() => persist({ analytics: true, replay: true })}
                className={`rounded-mdplus border px-4 py-2.5 font-semibold transition ${
                  recruiterTheme ? 'border-slate-300 text-slate-800 hover:bg-slate-100' : 'border-white/30 hover:bg-white/10'
                }`}
              >
                Aceitar todos
              </button>
              <button
                type="button"
                onClick={() => persist({ analytics: false, replay: false })}
                className={`rounded-mdplus border px-4 py-2.5 font-semibold transition ${
                  recruiterTheme ? 'border-slate-300 text-slate-800 hover:bg-slate-100' : 'border-white/30 hover:bg-white/10'
                }`}
              >
                Rejeitar não essenciais
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
