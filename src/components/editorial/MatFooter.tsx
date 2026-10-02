import { openPrivacyPreferences } from '../../lib/consent'
import { OWNER_EMAIL, WHATSAPP_CONTEXT_MESSAGES } from '../../lib/contact'
import { trackContact, trackProfile } from '../../lib/analytics'
import WhatsAppCta from '../WhatsAppCta'

export default function MatFooter() {
  return (
    <footer className="mat-footer">
      <div className="mat-wrap mat-footer-top">
        <div>
          <a className="mat-brand" href="/">
            MAT<span className="brand-dot">.</span>
          </a>
          <p>
            Sistemas sob medida
            <br />
            para empresas.
          </p>
          <span className="mat-label">Belo Horizonte — MG</span>
        </div>
        <nav aria-label="Rodapé">
          <a href="/#servicos">Soluções</a>
          <a href="/projetos/">Projetos</a>
          <a href="/#processo">Como funciona</a>
          <a href="/#sobre">Sobre</a>
        </nav>
        <div className="mat-footer-contact">
          <WhatsAppCta
            className="mat-text-link"
            location="commercial_footer"
            label="Falar no WhatsApp ↗"
            message={WHATSAPP_CONTEXT_MESSAGES.final}
          />
          <a
            href={`mailto:${OWNER_EMAIL}`}
            onClick={() => trackContact('email', 'commercial_footer')}
          >
            {OWNER_EMAIL}
          </a>
          <div className="mat-social">
            <a
              href="https://www.linkedin.com/in/marcelo-diogo-05289b264"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('linkedin', 'commercial_footer')}
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/MATTecno"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProfile('github', 'commercial_footer')}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
      <div className="mat-wrap mat-footer-bottom">
        <span>© {new Date().getFullYear()} MAT Tecnologia</span>
        <a href="/recrutadores/">Perfil profissional ↗</a>
        <a href="/privacidade/">Privacidade</a>
        <button type="button" onClick={openPrivacyPreferences}>
          Preferências de cookies
        </button>
      </div>
      <div className="mat-footer-word" aria-hidden="true">
        <svg viewBox="0 0 1050 310" focusable="false">
          <text x="0" y="335" fontSize="450" fontWeight="650" letterSpacing="-36">
            MAT<tspan fill="#2457c5">.</tspan>
          </text>
        </svg>
      </div>
    </footer>
  )
}
