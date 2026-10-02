import { readFile, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

// Render the same React components used by the browser. No duplicate SEO-only copy.
const server = await createServer({
  mode: 'production',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
})
try {
  const [
    { default: Home },
    { default: Contact },
    { default: Projects },
    { default: Case },
    { CASE_STUDY_PROJECTS },
  ] = await Promise.all([
    server.ssrLoadModule('/src/pages/App.tsx'),
    server.ssrLoadModule('/src/pages/ContactPage.tsx'),
    server.ssrLoadModule('/src/pages/ProjectsIndexPage.tsx'),
    server.ssrLoadModule('/src/pages/ProjectCasePage.tsx'),
    server.ssrLoadModule('/src/data/projects.ts'),
  ])
  const pages = [
    ['index.html', Home, {}],
    ['contato/index.html', Contact, {}],
    ['projetos/index.html', Projects, {}],
    ...CASE_STUDY_PROJECTS.map((project) => [
      `projetos/${project.caseStudy.slug}/index.html`,
      Case,
      { project },
    ]),
  ]
  for (const [file, Component, props] of pages) {
    const path = `dist/${file}`
    const html = await readFile(path, 'utf8')
    const markup = renderToString(createElement(Component, props))
    const root = /(<div id="root"[^>]*>)<\/div>/
    if (!root.test(html)) throw new Error(`Empty root missing in ${file}`)
    await writeFile(
      path,
      html.replace(root, (_, opening) => `${opening}${markup}</div>`)
    )
  }
  console.log(`Pré-renderizadas ${pages.length} páginas com conteúdo HTML completo.`)
} finally {
  await server.close()
}
