import { createRoot } from 'react-dom/client'
import PrivacyControls, { type PrivacyControlsTheme } from '../components/PrivacyControls'

const PRIVACY_CONTROLS_ROOT_ID = 'privacy-controls-root'

export function mountPrivacyControls(theme: PrivacyControlsTheme = 'default'): void {
  if (document.getElementById(PRIVACY_CONTROLS_ROOT_ID)) return
  const element = document.createElement('div')
  element.id = PRIVACY_CONTROLS_ROOT_ID
  document.body.append(element)
  createRoot(element).render(<PrivacyControls theme={theme} />)
}
