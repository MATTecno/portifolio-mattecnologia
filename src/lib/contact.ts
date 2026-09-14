export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || 'marcelos.diogo8@gmail.com'
export const OWNER_WHATSAPP = (import.meta.env.VITE_OWNER_WHATSAPP || '5531995797235').replace(/\D/g, '')
export const WHATSAPP_PROJECT_MESSAGE =
  'Olá! Gostaria de conversar sobre um sistema para minha empresa.'
export const WHATSAPP_ADS_MESSAGE =
  'Olá! Encontrei a MATTecnologia pelo Google e gostaria de conversar sobre um sistema para minha empresa.'
export const whatsappLink = (message: string) =>
  `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`
export const emailLink = (message: string) =>
  `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('Projeto para a MATTecnologia')}&body=${encodeURIComponent(message)}`
