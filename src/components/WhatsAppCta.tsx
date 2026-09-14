import { FaWhatsapp } from 'react-icons/fa'
import { trackContact } from '../lib/analytics'
import { WHATSAPP_PROJECT_MESSAGE, whatsappLink } from '../lib/contact'

type WhatsAppCtaProps = {
  location: string
  label: string
  className?: string
  message?: string
  icon?: boolean
  onClick?: () => void
}

export default function WhatsAppCta({
  location,
  label,
  className = 'site-button',
  message = WHATSAPP_PROJECT_MESSAGE,
  icon = false,
  onClick,
}: WhatsAppCtaProps) {
  return (
    <a
      className={`${className} ph-no-capture`}
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        onClick?.()
        trackContact('whatsapp', location)
      }}
    >
      {icon && <FaWhatsapp aria-hidden="true" />}
      {label}
    </a>
  )
}
