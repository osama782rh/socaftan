import { execSync } from 'child_process'
import { cpSync, mkdirSync } from 'fs'

const PRERENDERED_ROUTES = [
  'location-takchita-ile-de-france',
  'location-karakou-ile-de-france',
  'vente-caftan-ile-de-france',
  'sur-mesure',
  'cgv',
  'cgu',
  'confidentialite',
  'mentions-legales',
]

const run = (cmd) => {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

// 1. Build with Vite + prerender to dist/
run('npm run build:prerender')

// 2. Let Vercel prepare the output structure (runs plain vite build again internally)
run('vercel build --prod')

// 3. Run prerender again so dist/index.html is the prerendered version
//    (vercel build overwrites it with the plain version)
run('node scripts/prerender.js')

// 4. Copy prerendered subdirectories into vercel output
for (const route of PRERENDERED_ROUTES) {
  const src = `dist/${route}`
  const dest = `.vercel/output/static/${route}`
  mkdirSync(dest, { recursive: true })
  cpSync(src, dest, { recursive: true })
  console.log(`[deploy] Copied ${route}/`)
}

// 5. Deploy prebuilt output to Vercel production
run('vercel deploy --prebuilt --prod')
