import { FaWhatsapp } from 'react-icons/fa'
import { trackContact } from '../lib/analytics'
import { WHATSAPP_GENERAL_MESSAGE, whatsappLink } from '../lib/contact'

type WhatsAppFloatingButtonProps = {
  location?: string
  message?: string
}

export default function WhatsAppFloatingButton({
  location = 'floating_whatsapp',
  message = WHATSAPP_GENERAL_MESSAGE,
}: WhatsAppFloatingButtonProps) {
  return (
    <a
      className="whatsapp-float ph-no-capture"
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      onClick={() => trackContact('whatsapp', location)}
    >
      <FaWhatsapp aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  )
}
