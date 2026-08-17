import { openPrivacyPreferences } from '../lib/consent'

export default function Rodape() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm opacity-80">
        <p>© {year} MATTecnologia — Desenvolvimento de software sob medida.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
          <a href="/privacidade/" className="underline-offset-4 hover:underline focus:underline">
            Privacidade
          </a>
          <button type="button" onClick={openPrivacyPreferences} className="underline-offset-4 hover:underline focus:underline">
            Preferências de cookies
          </button>
        </div>
      </div>
    </footer>
  )
}
