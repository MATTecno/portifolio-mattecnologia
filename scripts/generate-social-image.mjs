import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

// Keep the editable artwork and exported sharing image together in version control.
for (const version of ['v3', 'v4']) {
  await sharp(fileURLToPath(new URL(`../assets/source/og-company-${version}.svg`, import.meta.url)))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(fileURLToPath(new URL(`../public/og-company-${version}.jpg`, import.meta.url)))
}
