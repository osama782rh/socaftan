import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(__dirname, '..', 'dist')

const ROUTES = [
  '/',
  '/location-takchita-ile-de-france',
  '/location-karakou-ile-de-france',
  '/vente-caftan-ile-de-france',
  '/sur-mesure',
  '/cgv',
  '/cgu',
  '/confidentialite',
  '/mentions-legales',
]

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url)

      if (!existsSync(filePath) || !extname(filePath)) {
        filePath = join(DIST, 'index.html')
      }

      try {
        const content = readFileSync(filePath)
        const ext = extname(filePath)
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' })
        res.end(content)
      } catch {
        res.writeHead(404)
        res.end('Not found')
      }
    })

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port
      resolve({ server, port })
    })
  })
}

async function prerender() {
  console.log('[prerender] Starting...')

  const { server, port } = await startServer()
  const baseUrl = `http://127.0.0.1:${port}`
  console.log(`[prerender] Server running on ${baseUrl}`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const route of ROUTES) {
    const url = `${baseUrl}${route}`
    console.log(`[prerender] Rendering ${route}`)

    const page = await browser.newPage()

    // Block unnecessary requests for faster rendering
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const type = req.resourceType()
      if (['image', 'font', 'media'].includes(type)) {
        req.abort()
      } else {
        req.continue()
      }
    })

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for React to render content inside #root
    await page.waitForSelector('#root > *', { timeout: 10000 })

    // Small delay to ensure SEOManager has applied meta tags
    await page.waitForFunction(
      () => document.title && document.title !== '',
      { timeout: 5000 }
    )

    let html = await page.content()

    // Remove any client-side scripts that would cause hydration issues
    // React will re-mount cleanly on top of the pre-rendered HTML
    await page.close()

    // Write pre-rendered HTML
    if (route === '/') {
      writeFileSync(join(DIST, 'index.html'), html, 'utf-8')
    } else {
      const dir = join(DIST, route.slice(1))
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'index.html'), html, 'utf-8')
    }

    console.log(`[prerender] Done: ${route}`)
  }

  await browser.close()
  server.close()
  console.log(`[prerender] All ${ROUTES.length} routes pre-rendered successfully!`)
}

prerender().catch((err) => {
  console.error('[prerender] Error:', err)
  process.exit(1)
})
