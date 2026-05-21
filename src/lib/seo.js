const SITE_URL = 'https://www.socaftan.fr'
const SITE_NAME = 'SO Caftan'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

// Note d'agregat utilisee dans plusieurs schemas (mise a jour quand de
// vrais avis Google seront disponibles). Reflete les 8 temoignages visibles
// sur /avis-clients pour le moment.
const AGGREGATE_RATING = {
  ratingValue: '5.0',
  bestRating: '5',
  worstRating: '1',
  reviewCount: '8',
}

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

const removeMeta = (selector) => {
  const elements = document.head.querySelectorAll(selector)
  elements.forEach((el) => el.remove())
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

// =====================================================================
// SCHEMA BUILDERS
// =====================================================================

export const buildBreadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path),
  })),
})

/**
 * FAQ schema avec Speakable pour Google Assistant / voice search.
 * Speakable marque les questions comme "speakable" (lisibles a voix haute).
 */
export const buildFaqSchema = (faqs, { withSpeakable = true } = {}) => {
  const base = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  if (withSpeakable) {
    base.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[itemprop=name]', '[itemprop=text]'],
    }
  }
  return base
}

/**
 * LocalBusiness schema enrichi pour SO Caftan.
 * Inclut openingHours, aggregateRating, amenityFeature, founder.
 */
export const buildLocalBusinessSchema = () => ({
  '@type': 'ClothingStore',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  telephone: '+33184180326',
  email: 'contact@socaftan.fr',
  description:
    "SO Caftan est specialisee dans la location de takchitas et karakous pour mariages et evenements orientaux en Ile-de-France, ainsi que la vente de caftans. Service de livraison disponible dans les departements 91, 92, 93 et 94.",
  priceRange: '90€ - 250€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Carte bancaire, virement',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '20 rue du Commandant Maurice Lissac',
    postalCode: '91250',
    addressLocality: 'Tigery',
    addressRegion: 'Ile-de-France',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 48.6167,
    longitude: 2.5167,
  },
  // Horaires (signal local SEO fort + utilise pour Google Knowledge Panel)
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '00:00',
      closes: '00:00',
      validFrom: '2026-01-01',
      validThrough: '2026-12-31',
      description: 'Sur rendez-vous uniquement',
    },
  ],
  // Note d'agregat (passe a 5 etoiles dans les SERP quand assez d'avis)
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: AGGREGATE_RATING.ratingValue,
    bestRating: AGGREGATE_RATING.bestRating,
    worstRating: AGGREGATE_RATING.worstRating,
    reviewCount: AGGREGATE_RATING.reviewCount,
  },
  // Equipements / particularites (Knowledge Panel)
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Paiement carte bancaire', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Livraison disponible', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Retrait sur rendez-vous', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Service WhatsApp', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Caftan sur-mesure', value: true },
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Ile-de-France' },
    { '@type': 'AdministrativeArea', name: 'Essonne' },
    { '@type': 'AdministrativeArea', name: 'Val-de-Marne' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-Seine' },
    { '@type': 'AdministrativeArea', name: 'Seine-Saint-Denis' },
    { '@type': 'City', name: 'Paris' },
    { '@type': 'City', name: 'Evry' },
    { '@type': 'City', name: 'Creteil' },
    { '@type': 'City', name: 'Versailles' },
  ],
  knowsLanguage: ['fr', 'ar'],
  knowsAbout: [
    'Location takchita',
    'Location karakou',
    'Vente caftan',
    'Mariage marocain',
    'Mariage algerien',
    'Soiree henna',
    'Tenue orientale Ile-de-France',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tenues orientales SO Caftan',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Location Takchita Ile-de-France',
          description: 'Location de takchita pour mariage, henna et evenements orientaux en Ile-de-France',
        },
        price: '90',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Location Karakou Ile-de-France',
          description: 'Location de karakou pour mariage et evenements orientaux en Ile-de-France',
        },
        price: '100',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Vente Caftan Ile-de-France',
          description: 'Vente de caftan de qualite superieure pour mariages et ceremonies orientales en Ile-de-France',
        },
        price: '180',
        priceCurrency: 'EUR',
      },
    ],
  },
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
  publisher: {
    '@id': `${SITE_URL}/#business`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?s={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const buildServiceSchema = ({ name, description, path, price }) => ({
  '@type': 'Service',
  name,
  description,
  provider: {
    '@id': `${SITE_URL}/#business`,
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
  // Si plusieurs avis vraiment lies au service, on heritera de AggregateRating
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: AGGREGATE_RATING.ratingValue,
    bestRating: AGGREGATE_RATING.bestRating,
    worstRating: AGGREGATE_RATING.worstRating,
    reviewCount: AGGREGATE_RATING.reviewCount,
  },
})

/**
 * Article schema pour les posts de blog.
 * Crucial pour le SEO blog : permet l'apparition dans Google Discover,
 * et donne aux articles un meilleur ranking sur les requetes informationnelles.
 */
export const buildArticleSchema = ({
  title,
  description,
  path,
  image,
  publishedAt,
  modifiedAt,
  authorName = SITE_NAME,
  articleSection,
  keywords = [],
}) => ({
  '@type': 'Article',
  headline: title,
  description,
  image: image ? (image.startsWith('http') ? image : toAbsoluteUrl(image)) : DEFAULT_IMAGE,
  datePublished: publishedAt,
  dateModified: modifiedAt || publishedAt,
  author: {
    '@type': 'Organization',
    name: authorName,
    url: SITE_URL,
  },
  publisher: {
    '@id': `${SITE_URL}/#business`,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': toAbsoluteUrl(path),
  },
  ...(articleSection ? { articleSection } : {}),
  ...(keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
  inLanguage: 'fr-FR',
})

/**
 * Product schema pour un modele du catalogue (takchita, karakou, caftan).
 * Affiche des "rich snippets" : prix, dispo, etoiles dans les SERP.
 */
export const buildProductSchema = ({
  name,
  description,
  image,
  category,
  rentalPrice,
  purchasePrice,
  productId,
  url,
}) => {
  const offers = []

  if (rentalPrice && Number(rentalPrice) > 0) {
    offers.push({
      '@type': 'Offer',
      name: `Location ${name}`,
      price: String(rentalPrice),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      url: url ? toAbsoluteUrl(url) : SITE_URL,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    })
  }
  if (purchasePrice && Number(purchasePrice) > 0) {
    offers.push({
      '@type': 'Offer',
      name: `Achat ${name}`,
      price: String(purchasePrice),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: url ? toAbsoluteUrl(url) : SITE_URL,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    })
  }

  return {
    '@type': 'Product',
    name,
    description: description || `${name} - tenue ${category} disponible en location ou a l'achat chez SO Caftan en Ile-de-France.`,
    image: image ? (image.startsWith('http') ? image : toAbsoluteUrl(image)) : DEFAULT_IMAGE,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: category || 'Caftan',
    ...(productId ? { sku: `socaftan-${productId}` } : {}),
    offers: offers.length === 1 ? offers[0] : (offers.length > 1 ? {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...offers.map((o) => Number(o.price))),
      highPrice: Math.max(...offers.map((o) => Number(o.price))),
      priceCurrency: 'EUR',
      offerCount: offers.length,
      offers,
    } : undefined),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_RATING.ratingValue,
      bestRating: AGGREGATE_RATING.bestRating,
      worstRating: AGGREGATE_RATING.worstRating,
      reviewCount: AGGREGATE_RATING.reviewCount,
    },
  }
}

/**
 * ItemList schema pour les pages de listing (galerie, catalogue).
 * Aide Google a comprendre que la page contient une liste de produits.
 */
export const buildItemListSchema = ({ name, items }) => ({
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: item.name,
      url: item.url ? toAbsoluteUrl(item.url) : SITE_URL,
      ...(item.image ? { image: item.image.startsWith('http') ? item.image : toAbsoluteUrl(item.image) } : {}),
    },
  })),
})

/**
 * Review schema pour les temoignages clients.
 */
export const buildReviewSchema = ({ author, datePublished, reviewBody, ratingValue = 5 }) => ({
  '@type': 'Review',
  author: {
    '@type': 'Person',
    name: author,
  },
  datePublished,
  reviewBody,
  reviewRating: {
    '@type': 'Rating',
    ratingValue: String(ratingValue),
    bestRating: '5',
    worstRating: '1',
  },
  itemReviewed: {
    '@id': `${SITE_URL}/#business`,
  },
})

// =====================================================================
// applySeo - main function
// =====================================================================

export const applySeo = ({
  title,
  description,
  path = '/',
  keywords = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow',
  schema = [],
  // Article-only props
  publishedAt,
  modifiedAt,
  articleSection,
  articleAuthor,
}) => {
  const cleanPath = sanitizePath(path)
  const canonicalUrl = toAbsoluteUrl(cleanPath)
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const absoluteImage = image && /^https?:\/\//i.test(image) ? image : toAbsoluteUrl(image || DEFAULT_IMAGE)

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
  ensureMeta('meta[property="og:image"]', { property: 'og:image' }, absoluteImage)
  ensureMeta('meta[property="og:image:width"]', { property: 'og:image:width' }, '1200')
  ensureMeta('meta[property="og:image:height"]', { property: 'og:image:height' }, '630')
  ensureMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, fullTitle)

  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, fullTitle)
  ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
  ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, absoluteImage)

  // Article-specific Open Graph tags
  if (type === 'article') {
    if (publishedAt) ensureMeta('meta[property="article:published_time"]', { property: 'article:published_time' }, publishedAt)
    if (modifiedAt) ensureMeta('meta[property="article:modified_time"]', { property: 'article:modified_time' }, modifiedAt)
    if (articleSection) ensureMeta('meta[property="article:section"]', { property: 'article:section' }, articleSection)
    if (articleAuthor) ensureMeta('meta[property="article:author"]', { property: 'article:author' }, articleAuthor)
    if (Array.isArray(keywords) && keywords.length > 0) {
      // Tags (multiple article:tag meta possible, mais on regroupe)
      ensureMeta('meta[property="article:tag"]', { property: 'article:tag' }, keywords.join(', '))
    }
  } else {
    // Cleanup article tags si on change de page article -> page standard
    removeMeta('meta[property="article:published_time"]')
    removeMeta('meta[property="article:modified_time"]')
    removeMeta('meta[property="article:section"]')
    removeMeta('meta[property="article:author"]')
    removeMeta('meta[property="article:tag"]')
  }

  ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })
  ensureLink('link[rel="alternate"][hreflang="fr-FR"]', { rel: 'alternate', hreflang: 'fr-FR', href: canonicalUrl })
  ensureLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl })

  ensureJsonLd(schema)
}

export const seoConfig = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultImage: DEFAULT_IMAGE,
  aggregateRating: AGGREGATE_RATING,
}
