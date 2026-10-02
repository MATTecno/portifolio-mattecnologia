import { createRoot, hydrateRoot } from 'react-dom/client'
import type { ReactNode } from 'react'

export function mountPage(element: HTMLElement, page: ReactNode, hasPersonalContext = false) {
  // Query-based briefings are private per visit and intentionally absent from static HTML.
  if (element.hasChildNodes() && !hasPersonalContext) hydrateRoot(element, page)
  else createRoot(element).render(page)
}
