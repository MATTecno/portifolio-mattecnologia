import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDirectory = join(projectRoot, 'public')
const sourceDirectory = join(projectRoot, 'assets', 'source')

const webpOptions = { quality: 82, effort: 6 }

async function generateWebpVariants(relativePath, outputBaseName, widths) {
  const sourcePath = join(sourceDirectory, relativePath)
  const source = await readFile(sourcePath)

  for (const width of widths) {
    const outputPath = join(publicDirectory, `${outputBaseName}-${width}.webp`)
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp(webpOptions)
      .toFile(outputPath)
  }

  return source
}

for (const project of ['convites', 'estoque', 'zd-signature']) {
  const relativePath = `projects/${project}.webp`
  const source = await generateWebpVariants(relativePath, `projects/${project}`, [480, 800])
  await sharp(source)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp(webpOptions)
    .toFile(join(publicDirectory, relativePath))
}

const profileSource = await generateWebpVariants('marcelo-profissional.webp', 'marcelo-profissional', [160, 320, 480])
await sharp(profileSource)
  .resize({ width: 480, height: 480, fit: 'cover', position: 'centre' })
  .webp(webpOptions)
  .toFile(join(publicDirectory, 'marcelo-profissional.webp'))

const faviconSource = await readFile(join(sourceDirectory, 'favicon.png'))
await sharp(faviconSource).resize(32, 32).png({ compressionLevel: 9, palette: true }).toFile(join(publicDirectory, 'favicon-32.png'))
await sharp(faviconSource).resize(192, 192).png({ compressionLevel: 9, palette: true }).toFile(join(publicDirectory, 'favicon-192.png'))
await sharp(faviconSource).resize(192, 192).png({ compressionLevel: 9, palette: true }).toFile(join(publicDirectory, 'favicon.png'))

console.log('Imagens responsivas geradas em public/.')
