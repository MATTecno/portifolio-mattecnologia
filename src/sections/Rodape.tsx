import { openPrivacyPreferences } from '../lib/consent'
export default function Rodape() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-layout">
        <div>
          <a className="site-brand" href="/">
            MAT<span>Tecnologia</span>
          </a>
          <p>Software sob medida. Atendimento direto com Marcelo Diogo.</p>
          <p className="site-caption">© {new Date().getFullYear()} MATTecnologia</p>
        </div>
        <div className="footer-links">
          <a href="/recrutadores/">Perfil profissional</a>
          <a href="/privacidade/">Privacidade</a>
          <button type="button" onClick={openPrivacyPreferences}>
            Preferências de cookies
          </button>
        </div>
      </div>
    </footer>
  )
}
