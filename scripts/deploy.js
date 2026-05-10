import { execSync } from 'child_process'
import { cpSync, mkdirSync, existsSync, unlinkSync } from 'fs'

const PRERENDERED_ROUTES = [
  'location-takchita-ile-de-france',
  'location-karakou-ile-de-france',
  'vente-caftan-ile-de-france',
  'location-caftan-mariage',
  'location-caftan-essonne',
  'location-caftan-evry',
  'location-tenue-henna',
  'location-caftan-pas-cher',
  'contact',
  'a-propos',
  'galerie',
  'avis-clients',
  'quiz',
  'blog',
  'blog/choisir-takchita-mariage-marocain',
  'blog/henna-marocaine-vs-algerienne',
  'blog/cout-location-caftan-ile-de-france',
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

// IMPORTANT : ce script build LOCALEMENT (Vercel ne peut pas executer Puppeteer
// sur leurs runners). Les variables d'environnement utilisees par le frontend
// (VITE_*) doivent donc etre dans .env (a la racine du projet).
// Les variables Vercel chiffrees ne sont pas accessibles localement.
//
// Si vous avez ajoute une nouvelle env var sur Vercel, ajoutez-la AUSSI
// dans le .env local pour qu'elle soit incluse dans le bundle.

// Cleanup d'un eventuel .env.production.local genere par un vercel env pull
// qui aurait des valeurs chiffrees vides (overrides .env avec une string vide)
if (existsSync('.env.production.local')) {
  unlinkSync('.env.production.local')
  console.log('[deploy] Cleaned .env.production.local (avoid empty encrypted values overriding .env)')
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
