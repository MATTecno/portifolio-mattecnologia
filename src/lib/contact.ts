export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'marcelos.diogo8@gmail.com'
export const OWNER_WHATSAPP = (import.meta.env.VITE_OWNER_WHATSAPP || '5531995797235').replace(/\D/g, '')
export const WHATSAPP_LANDING_MESSAGE =
  'Olá! Gostaria de conversar sobre uma landing page ou site para minha empresa.'
export const WHATSAPP_GENERAL_MESSAGE =
  'Olá! Gostaria de conversar sobre um site, landing page ou sistema para minha empresa.'
export const WHATSAPP_PROJECT_MESSAGE =
  'Olá! Gostaria de conversar sobre um sistema para minha empresa.'
export const WHATSAPP_ADS_MESSAGE =
  'Olá! Encontrei a MATTecnologia pelo Google e gostaria de conversar sobre um sistema para minha empresa.'
export const WHATSAPP_BAJA_MESSAGE =
  'Olá! Vim pelo QR Code do Baja e queria conversar sobre um sistema para minha empresa.'
export const whatsappLink = (message: string) =>
  `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`
export const emailLink = (message: string) =>
  `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('Projeto para a MATTecnologia')}&body=${encodeURIComponent(message)}`

export const WHATSAPP_CONTEXT_MESSAGES = {
  hero: 'Olá! Tenho um problema/processo na minha empresa e queria entender se vocês conseguem me ajudar.',
  systems: 'Olá! Quero conversar sobre um sistema sob medida.',
  automation: 'Olá! Quero entender se dá para automatizar um processo da minha empresa.',
  digital: 'Olá! Quero conversar sobre um projeto digital para minha empresa.',
  chaos: 'Olá! Tenho um processo na minha empresa que hoje é bem manual e queria entender se dá para transformar em sistema.',
  final: 'Olá! Quero explicar um problema da minha empresa e entender se dá para transformar em uma solução digital.',
} as const

export const projectWhatsAppMessage = (name: string) =>
  `Olá! Vi o projeto ${name} e gostaria de conversar sobre algo parecido.`
