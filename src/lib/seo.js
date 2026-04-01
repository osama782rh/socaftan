const SITE_URL = 'https://www.socaftan.fr'
const SITE_NAME = 'SO Caftan'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

const ensureMeta = (selector, attrs, content) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const ensureLink = (selector, attrs) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

const ensureJsonLd = (schema) => {
  const scriptId = 'seo-structured-data'
  const existing = document.getElementById(scriptId)

  if (existing) {
    existing.remove()
  }

  if (!schema || (Array.isArray(schema) && schema.length === 0)) {
    return
  }

  const payload = Array.isArray(schema)
    ? { '@context': 'https://schema.org', '@graph': schema }
    : schema

  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(payload)
  document.head.appendChild(script)
}

const toAbsoluteUrl = (pathOrUrl = '/') => {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${cleanPath}`
}

const sanitizePath = (path = '/') => {
  const normalized = path || '/'
  const [withoutQuery] = normalized.split('?')
  const [withoutHash] = withoutQuery.split('#')
  return withoutHash || '/'
}

export const buildBreadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  })),
})

export const buildFaqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})

export const buildLocalBusinessSchema = () => ({
  '@type': 'ClothingStore',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  telephone: '+33184180326',
  email: 'contact@socaftan.fr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '20 rue du Commandant Maurice Lissac',
    postalCode: '91250',
    addressLocality: 'Tigery',
    addressCountry: 'FR',
  },
  areaServed: [
    'Paris',
    'Essonne',
    'Seine-et-Marne',
    'Yvelines',
    'Hauts-de-Seine',
    'Val-de-Marne',
    "Val-d'Oise",
    'Ile-de-France',
  ],
  sameAs: [
    'https://www.instagram.com/so_caftan91/',
    'https://www.tiktok.com/@so_caftan91',
  ],
})

export const buildWebsiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'fr-FR',
})

export const buildServiceSchema = ({ name, description, path, price }) => ({
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Ile-de-France',
  },
  url: toAbsoluteUrl(path),
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: String(price),
    availability: 'https://schema.org/InStock',
    url: toAbsoluteUrl(path),
  },
})

export const applySeo = ({
  title,
  description,
  path = '/',
  keywords = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow',
  schema = [],
}) => {
  const cleanPath = sanitizePath(path)
  const canonicalUrl = toAbsoluteUrl(cleanPath)
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  document.documentElement.lang = 'fr'
  document.title = fullTitle

  ensureMeta('meta[name="description"]', { name: 'description' }, description)
  ensureMeta('meta[name="robots"]', { name: 'robots' }, robots)
  ensureMeta('meta[name="author"]', { name: 'author' }, SITE_NAME)
  ensureMeta('meta[name="keywords"]', { name: 'keywords' }, Array.isArray(keywords) ? keywords.join(', ') : keywords)

  ensureMeta('meta[property="og:type"]', { property: 'og:type' }, type)
  ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE_NAME)
  ensureMeta('meta[property="og:locale"]', { property: 'og:locale' }, 'fr_FR')
  ensureMeta('meta[property="og:title"]', { property: 'og:title' }, fullTitle)
  ensureMeta('meta[property="og:description"]', { property: 'og:description' }, description)
  ensureMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
  ensureMeta('meta[property="og:image"]', { property: 'og:image' }, image)

  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, fullTitle)
  ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
  ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image)

  ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })
  ensureLink('link[rel="alternate"][hreflang="fr-FR"]', { rel: 'alternate', hreflang: 'fr-FR', href: canonicalUrl })
  ensureLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl })

  ensureJsonLd(schema)
}

export const seoConfig = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultImage: DEFAULT_IMAGE,
}
