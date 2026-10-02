import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function rejectOptional(page: Page) {
  const button = page.getByRole('button', { name: 'Rejeitar não essenciais', exact: true })
  await button.click()
}

for (const width of [375, 768, 1440, 1920]) {
  test(`home real em ${width}px: mídia, navegação, console e overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 1000 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.goto('/')
    await rejectOptional(page)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('[data-project-id]')).toHaveCount(3)
    expect(
      await page
        .locator('[data-project-id]')
        .evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.projectId))
    ).toEqual(['apublicitaria', 'brutona', 'vm-viagens'])
    for (const section of [
      '#servicos',
      '.chaos-story',
      '[data-project-id="apublicitaria"]',
      '[data-project-id="brutona"]',
      '[data-project-id="vm-viagens"]',
      '#processo',
      '#sobre',
      '#contato',
      '#perguntas',
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
    }
    for (const img of await page.locator('main img').all()) {
      if (await img.isVisible()) {
        await img.scrollIntoViewIfNeeded()
        await expect
          .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
          .toBe(true)
      }
    }
    if (width < 1100) {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await page.locator('#mat-menu').getByRole('link', { name: 'Projetos', exact: true }).click()
      await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    }
    expect(errors).toEqual([])
    await page.screenshot({ path: `test-results/home-${width}.png` })
  })
}

test('accordion funciona por toque e teclado, com links contextuais', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await rejectOptional(page)
  const services = ['systems', 'automation', 'digital']
  for (const id of services) {
    const button = page.locator(`#service-button-${id}`)
    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const region = page.locator(`#service-${id}`)
    await expect(region).toBeVisible()
    const href = await region.getByRole('link').getAttribute('href')
    expect(new URL(href!).hostname).toBe('wa.me')
    expect(new URL(href!).searchParams.get('text')).toContain('Olá!')
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(region).toBeHidden()
  }
  await page.getByText('Preciso saber exatamente qual sistema quero?', { exact: true }).click()
  await expect(
    page.getByText(
      'Não. Podemos começar pelo problema e entender juntos qual solução faz sentido.',
      { exact: true }
    )
  ).toBeVisible()
})

test('menu mantém teclado dentro do painel e fecha ao mudar para desktop', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await rejectOptional(page)
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.locator('#mat-menu a').first()).toBeFocused()
  await page.locator('#mat-menu a').last().focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('#mat-menu a').last()).toBeFocused()
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.locator('.mat-header')).not.toHaveClass(/menu-open/)
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('movimento reduzido mantém narrativa, cases e CTA acessíveis', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await rejectOptional(page)
  await expect(page.locator('.mat-page')).not.toHaveClass(/motion-ready/)
  expect(
    await page.locator('.chaos-sticky').evaluate((el) => getComputedStyle(el).position)
  ).not.toBe('sticky')
  expect(await page.locator('.organized-flow').evaluate((el) => getComputedStyle(el).opacity)).toBe(
    '1'
  )
  await page.locator('.chaos-conclusion a').scrollIntoViewIfNeeded()
  await expect(page.locator('.chaos-conclusion a')).toBeVisible()
  expect(
    await page
      .locator('.project-sticky')
      .first()
      .evaluate((el) => getComputedStyle(el).position)
  ).not.toBe('sticky')
  await page.getByRole('link', { name: 'Conhecer projeto aPublicitária', exact: true }).click()
  await expect(page).toHaveURL(/\/projetos\/apublicitaria\//)
  await expect(page.locator('h1')).toHaveText('aPublicitária')
})

test('âncora antiga de briefing e referência de projeto continuam funcionando', async ({
  page,
}) => {
  await page.goto(
    '/?projeto=brutona&utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh#estimativa'
  )
  await expect(page).toHaveURL(/\/contato\//)
  await rejectOptional(page)
  await expect(
    page.getByText('Brutona — Charcutaria Artesanal', { exact: true }).first()
  ).toBeVisible()
  await page.locator('#briefing-type').selectOption('automacao')
  await page.locator('#briefing-description').fill('Organizar os pedidos da empresa')
  const contact = page.locator('#contato a[href*="wa.me"]').first()
  expect(new URL((await contact.getAttribute('href'))!).searchParams.get('text')).toContain(
    'Brutona'
  )
  const summary = page.locator('#estimativa a[href*="wa.me"]').first()
  expect(new URL((await summary.getAttribute('href'))!).searchParams.get('text')).toContain(
    'Organizar os pedidos da empresa'
  )
})

test('rotas divulgadas, metadados, links internos e imagens permanecem disponíveis', async ({
  page,
  request,
}) => {
  const paths = [
    '/',
    '/baja/',
    '/sistemas-sob-medida-bh/',
    '/recrutadores/',
    '/privacidade/',
    '/demos/assinatura/',
    '/projetos/',
    '/contato/',
    ...[
      'apublicitaria',
      'brutona',
      'vm-viagens',
      'convites',
      'estoque',
      'zd-signature-input',
      'pdv',
    ].map((slug) => `/projetos/${slug}/`),
  ]
  for (const path of paths) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toMatch(/<title>.+<\/title>/)
    if (path !== '/demos/assinatura/') expect(html).toContain('rel="canonical"')
  }
  for (const path of [
    '/',
    '/projetos/',
    '/contato/',
    '/projetos/apublicitaria/',
    '/projetos/brutona/',
    '/projetos/vm-viagens/',
  ]) {
    await page.goto(path)
    const links = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) => [...new Set(els.map((el) => el.getAttribute('href')!))])
    for (const link of links) expect((await request.get(link)).status()).toBe(200)
  }
  expect((await request.get('/robots.txt')).status()).toBe(200)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('/projetos/apublicitaria/')
})

test('pré-renderização entrega conteúdo essencial sem JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: 'http://127.0.0.1:4175',
  })
  const page = await context.newPage()
  for (const path of [
    '/',
    '/projetos/',
    '/projetos/apublicitaria/',
    '/projetos/brutona/',
    '/projetos/vm-viagens/',
  ]) {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.locator('main').innerText()).not.toBe('')
  }
  await context.close()
})

test('a11y WCAG AA da home e cases, incluindo menu mobile', async ({ page }) => {
  for (const path of ['/', '/projetos/', '/projetos/apublicitaria/', '/projetos/brutona/']) {
    await page.goto(path)
    if (path === '/') await rejectOptional(page)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(
      results.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map(({ target }) => target),
      }))
    ).toEqual([])
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations.map(({ id }) => id)).toEqual([])
})

test('WhatsApp e Ads respeitam consentimento e mantêm conversão contextual sem enviar contatos', async ({
  page,
}) => {
  // Do not deliver test events to external providers or open a real conversation.
  await page.route('https://**/*', (route) =>
    route.fulfill({
      status: 200,
      contentType: route.request().url().includes('googletagmanager')
        ? 'application/javascript'
        : 'application/json',
      body: route.request().url().includes('googletagmanager') ? '' : '{}',
    })
  )
  await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=sistemas_bh')
  const cta = page.locator('.mat-hero .mat-button')
  const preventNavigation = () =>
    cta.evaluate((el) =>
      el.addEventListener('click', (event) => event.preventDefault(), { once: true })
    )
  const conversionCount = () =>
    page.evaluate(() => {
      const target = window as Window & { dataLayer?: Array<ArrayLike<unknown>> }
      return (target.dataLayer ?? []).filter(
        (event) => event[0] === 'event' && event[1] === 'conversion'
      ).length
    })
  await preventNavigation()
  await cta.click()
  expect(await conversionCount()).toBe(0)
  await page.getByRole('button', { name: 'Personalizar', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Métricas e feedback' }).check()
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click()
  await preventNavigation()
  await cta.click()
  expect(await conversionCount()).toBe(1)
  expect(new URL(page.url()).searchParams.get('utm_campaign')).toBe('sistemas_bh')
  expect(new URL((await cta.getAttribute('href'))!).searchParams.get('text')).toContain(
    'problema/processo'
  )
  await page.getByRole('button', { name: 'Preferências de cookies' }).click()
  await page.getByRole('checkbox', { name: 'Métricas e feedback' }).uncheck()
  await page.getByRole('button', { name: 'Salvar preferências', exact: true }).click()
  await page.waitForLoadState('networkidle')
  await preventNavigation()
  await cta.click()
  expect(await conversionCount()).toBe(0)
})
