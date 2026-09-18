import CommercialHeader from '../components/CommercialHeader'
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton'
import { COMMERCIAL_FAQ } from '../data/faq'
import { WHATSAPP_ADS_MESSAGE } from '../lib/contact'
import ComoTrabalho from '../sections/ComoTrabalho'
import Diferencial from '../sections/Diferencial'
import FAQ from '../sections/FAQ'
import FinalCta from '../sections/FinalCta'
import Hero from '../sections/Hero'
import Problemas from '../sections/Problemas'
import Projetos from '../sections/Projetos'
import Rodape from '../sections/Rodape'
import Servicos from '../sections/Servicos'
import Sobre from '../sections/Sobre'

const LANDING_NAV = [
  ['Problemas', 'problemas'],
  ['Soluções', 'servicos'],
  ['Como funciona', 'processo'],
  ['Projetos', 'portfolio'],
] as const

export default function AdsLandingPage() {
  return (
    <div className="commercial-theme commercial-page ads-landing-page">
      <CommercialHeader
        home
        items={LANDING_NAV}
        whatsappLocation="ads_header"
        whatsappMessage={WHATSAPP_ADS_MESSAGE}
      />
      <main id="conteudo">
        <Hero variant="landing" />
        <Problemas variant="landing" />
        <Servicos variant="landing" />
        <ComoTrabalho variant="landing"
          showAbout={false}
          ctaLocation="ads_process"
          ctaMessage={WHATSAPP_ADS_MESSAGE}
        />
        <Projetos variant="landing" />
        <Diferencial variant="landing" />
        <div className="site-container landing-about">
          <Sobre />
        </div>
        <FAQ items={COMMERCIAL_FAQ} />
        <FinalCta variant="landing" location="ads_final_cta" message={WHATSAPP_ADS_MESSAGE} />
      </main>
      <Rodape />
      <WhatsAppFloatingButton location="ads_floating" message={WHATSAPP_ADS_MESSAGE} />
    </div>
  )
}
