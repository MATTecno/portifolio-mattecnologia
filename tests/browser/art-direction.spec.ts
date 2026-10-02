import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function openHome(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Rejeitar não essenciais', exact: true }).click()
}
async function positionProject(page: Page, id: string) {
  await page
    .locator(`[data-project-id="${id}"]`)
    .evaluate((el) =>
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' })
    )
  await expect(page.locator('.mat-page')).toHaveAttribute('data-active-project', id)
}

for (const width of [375, 768, 1440, 1920]) {
  test(`hero imediato e temas completos em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 1000 })
    await openHome(page)
    await page.mouse.move(0, 0)
    await page.evaluate(() => document.fonts.ready)
    const originalIcon = await page.locator('link[rel="icon"]').getAttribute('href')
    const originalType = await page.locator('link[rel="icon"]').getAttribute('type')
    const originalColor = await page.locator('meta[name="theme-color"]').getAttribute('content')
    const hero = page.locator('.mat-hero')
    await page.evaluate(() => scrollTo({ top: 1, behavior: 'instant' }))
    await expect
      .poll(() =>
        hero.evaluate((el) => parseFloat((el as HTMLElement).style.getPropertyValue('--progress')))
      )
      .toBeGreaterThan(0)
    // Compacting the header must not move document content or alter the scroll position.
    const headerShift = await hero.evaluate(async (el) => {
      const top = el.getBoundingClientRect().top + scrollY
      scrollTo({ top: 40, behavior: 'instant' })
      const start = performance.now()
      let shift = 0
      while (performance.now() - start < 300) {
        await new Promise(requestAnimationFrame)
        shift = Math.max(shift, Math.abs(el.getBoundingClientRect().top + scrollY - top))
      }
      return { shift, scroll: scrollY }
    })
    expect(headerShift.shift).toBeLessThan(0.1)
    expect(headerShift.scroll).toBe(40)
    await page.evaluate(() => scrollTo({ top: 80, behavior: 'instant' }))
    await expect
      .poll(() => page.locator('.hero-real').evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBeGreaterThan(0.2)
    await page.evaluate(() => scrollTo({ top: innerHeight * 0.35, behavior: 'instant' }))
    await expect
      .poll(() => page.locator('.hero-real').evaluate((el) => Number(getComputedStyle(el).opacity)))
      .toBe(1)
    const projects = [
      ['apublicitaria', '/projects/icons/apublicitaria.png', '#4a1a3f'],
      ['brutona', '/projects/icons/brutona.png', '#a0121b'],
      ['vm-viagens', '/projects/icons/vm-viagens.ico', '#102b4b'],
    ]
    for (const [id, icon, color] of projects) {
      await positionProject(page, id)
      await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', icon)
      await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', color)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      await expect(page.locator('.mat-header')).toBeVisible()
      const response = await page.request.get(icon)
      expect(response.status()).toBe(200)
      await page
        .locator(`[data-project-id="${id}"] img`)
        .evaluate((el: HTMLImageElement) => el.decode())
      await page.screenshot({ path: `test-results/theme-${width}-${id}.png` })
    }
    await page.locator('#processo').scrollIntoViewIfNeeded()
    await expect(page.locator('.mat-page')).not.toHaveAttribute('data-active-project')
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', originalIcon!)
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('type', originalType!)
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      originalColor!
    )
    // Reverse scroll also restores the exact MAT metadata before the scenes.
    await positionProject(page, 'brutona')
    await page.locator('#servicos').scrollIntoViewIfNeeded()
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', originalIcon!)
  })
}

test('favicon estável, transição progressiva e cursor apenas na mídia', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await openHome(page)
  await positionProject(page, 'apublicitaria')
  await page.evaluate(() => {
    const target = window as Window & { iconMutations?: number }
    target.iconMutations = 0
    new MutationObserver((records) => {
      target.iconMutations! += records.length
    }).observe(document.querySelector('link[rel="icon"]')!, { attributes: true })
  })
  for (const delta of [10, 10, -5, 10]) {
    await page.evaluate((y) => scrollBy({ top: y, behavior: 'instant' }), delta)
    await page.waitForTimeout(40)
  }
  expect(
    await page.evaluate(() => (window as Window & { iconMutations: number }).iconMutations)
  ).toBe(0)
  const boundary = await page
    .locator('[data-project-id="brutona"]')
    .evaluate((el) => el.getBoundingClientRect().top + scrollY)
  const colors: string[] = []
  for (const offset of [-100, 0, 100]) {
    await page.evaluate(
      ({ boundary, offset }) =>
        scrollTo({ top: boundary - innerHeight * 0.5 + offset, behavior: 'instant' }),
      { boundary, offset }
    )
    await page.waitForTimeout(60)
    colors.push(
      await page.locator('.mat-projects').evaluate((el) => getComputedStyle(el).backgroundColor)
    )
  }
  expect(new Set(colors).size).toBe(3)
  await positionProject(page, 'brutona')
  const media = page.locator('[data-project-id="brutona"] .project-media')
  await media.hover({ position: { x: 180, y: 150 } })
  await expect
    .poll(() =>
      media.locator('.project-cursor').evaluate((el) => Number(getComputedStyle(el).opacity))
    )
    .toBe(1)
  expect(await media.evaluate((el) => getComputedStyle(el).cursor)).not.toBe('none')
  expect(
    await media.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--cursor-x'))
  ).not.toBe('')
})

test('temas continuam com reduced-motion e restauram depois de sair', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openHome(page)
  await positionProject(page, 'brutona')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#a0121b')
  expect(
    await page
      .locator('.project-media')
      .first()
      .evaluate((el) => getComputedStyle(el).transform)
  ).toBe('none')
  expect(
    await page
      .locator('.project-sticky')
      .first()
      .evaluate((el) => getComputedStyle(el).position)
  ).toBe('static')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.mat-page')).toHaveAttribute('data-active-project', 'brutona')
  await page.locator('#processo').scrollIntoViewIfNeeded()
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon-32.png')
})

test('contraste e navegação permanecem acessíveis em cada universo visual', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openHome(page)
  for (const id of ['apublicitaria', 'brutona', 'vm-viagens']) {
    await positionProject(page, id)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(
      result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))
    ).toEqual([])
  }
})
