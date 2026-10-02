import { test, expect } from '@playwright/test'

for (const [width, height] of [
  [375, 812],
  [430, 932],
  [768, 1000],
  [1280, 720],
  [1440, 900],
  [1920, 1000],
  [2560, 1440],
]) {
  test(`mídia permanece no Hero durante todo o scroll em ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'Rejeitar não essenciais', exact: true }).click()
    await page.mouse.move(0, 0)
    await page.evaluate(() => document.fonts.ready)
    const hero = page.locator('.mat-hero')
    const end = await hero.evaluate((el) => el.getBoundingClientRect().bottom + scrollY)
    const positions = Array.from({ length: 13 }, (_, index) => (end * index) / 12)
    for (const top of [...positions, ...positions.toReversed()]) {
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), top)
      await page.waitForTimeout(40)
      const state = await hero.evaluate((el) => {
        const media = el.querySelector('.hero-real')!
        const section = el.getBoundingClientRect()
        const bounds = media.getBoundingClientRect()
        const next = document.querySelector('#servicos')!.getBoundingClientRect()
        return {
          opacity: Number(getComputedStyle(media).opacity),
          visible: section.bottom > 0,
          mediaBottom: bounds.bottom,
          heroBottom: section.bottom,
          nextTop: next.top,
          overflow: document.documentElement.scrollWidth - innerWidth,
        }
      })
      expect(state.overflow).toBe(0)
      expect(state.nextTop).toBeGreaterThanOrEqual(state.heroBottom - 0.1)
      if (state.visible && state.opacity > 0.2)
        expect(state.mediaBottom).toBeLessThanOrEqual(state.heroBottom + 0.1)
    }
    await hero.getByRole('link', { name: 'Quero resolver um problema' }).click({ trial: true })
    await expect(hero.getByRole('link', { name: 'Quero resolver um problema' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\//
    )
    await hero.getByRole('link', { name: 'Ver projetos' }).click()
    await expect(page).toHaveURL(/#portfolio$/)
    expect(errors).toEqual([])
  })
}
