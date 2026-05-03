import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, parse } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ASSETS_DIR = join(__dirname, '..', 'src', 'assets')

const targets = [
  'EMERAUDE.png',
  'LILAS.png',
  'SAFRAN.png',
  'SOULTANA_DE_FES.png',
  'INDIGO.png',
  'IMPERIAL_BRONZE.png',
]

const optimizeJpegs = [
  'ANDALOUSE.jpeg',
  'AZUR_MAGENTA.jpeg',
  'CAFTAN_AMBRE.jpeg',
  'JADE.jpeg',
  'JAWHARA.jpeg',
  'KARAKOU_IMPERIAL.jpeg',
  'POURPE.jpeg',
  'ROYALE.jpeg',
  'SFIFA_ROYALE.jpeg',
  'TAKCHITA_BLEU_MAJESTE.jpeg',
  'TAKCHITA_NUIT_ROYALE.jpeg',
  'TAKCHITA_SULTANA.jpeg',
]

const formatBytes = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

async function convertToWebP(filename) {
  const src = join(ASSETS_DIR, filename)
  const { name } = parse(filename)
  const dest = join(ASSETS_DIR, `${name}.webp`)

  const srcStat = await stat(src)
  const srcSize = srcStat.size

  await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(dest)

  const destStat = await stat(dest)
  const destSize = destStat.size
  const reduction = ((1 - destSize / srcSize) * 100).toFixed(0)

  console.log(`[convert] ${filename} (${formatBytes(srcSize)}) -> ${name}.webp (${formatBytes(destSize)})  -${reduction}%`)
}

async function optimizeJpeg(filename) {
  const src = join(ASSETS_DIR, filename)
  const { name } = parse(filename)
  const dest = join(ASSETS_DIR, `${name}.webp`)

  const srcStat = await stat(src)
  const srcSize = srcStat.size

  await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(dest)

  const destStat = await stat(dest)
  const destSize = destStat.size
  const reduction = ((1 - destSize / srcSize) * 100).toFixed(0)

  console.log(`[convert] ${filename} (${formatBytes(srcSize)}) -> ${name}.webp (${formatBytes(destSize)})  -${reduction}%`)
}

async function main() {
  console.log('=== Converting PNG -> WebP ===')
  for (const file of targets) {
    await convertToWebP(file)
  }
  console.log('\n=== Converting JPEG -> WebP ===')
  for (const file of optimizeJpegs) {
    await optimizeJpeg(file)
  }
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
