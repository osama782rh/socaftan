import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  applySeo,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildWebsiteSchema,
  seoConfig,
} from '../lib/seo'

const homeFaqs = [
  {
    question: 'Quels sont les tarifs des locations SO Caftan ?',
    answer: 'Les takchitas sont en location a 90€, les karakous a 100€, avec une caution de 100€ par piece.',
  },
  {
    question: 'Quel est le prix de vente des caftans ?',
    answer: 'Les caftans de la collection sont proposes a 180€ en vente.',
  },
  {
    question: 'Dans quelles villes livrez-vous ou organisez-vous le retrait ?',
    answer: "SO Caftan intervient principalement en Ile-de-France, notamment Paris et sa region.",
  },
]

const routeSeoMap = {
  '/': {
    title: 'Location Takchita et Karakou en Ile-de-France, Vente Caftan 180€',
    description:
      "SO Caftan propose la location de takchitas (90€), la location de karakous (100€) et la vente de caftans (180€) en Ile-de-France. Reservation rapide et paiement securise.",
    keywords: [
      'location takchita ile de france',
      'location karakou paris',
      'vente caftan 180',
      'boutique caftan ile de france',
      'so caftan',
    ],
    schema: [
      buildWebsiteSchema(),
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Takchita Ile-de-France',
        description: 'Location de takchitas pour mariages et ceremonies.',
        path: '/',
        price: 90,
      }),
      buildServiceSchema({
        name: 'Location Karakou Ile-de-France',
        description: 'Location de karakous pour evenements et fetes.',
        path: '/',
        price: 100,
      }),
      buildServiceSchema({
        name: 'Vente Caftan Ile-de-France',
        description: 'Vente de caftans de la collection au prix fixe de 180€.',
        path: '/',
        price: 180,
      }),
      buildFaqSchema(homeFaqs),
    ],
  },
  '/location-takchita-ile-de-france': {
    title: 'Location Takchita Ile-de-France a 90€',
    description:
      'Louez votre takchita en Ile-de-France pour 90€. Service SO Caftan: reservation, accompagnement et retrait organise rapidement.',
    keywords: [
      'location takchita ile de france',
      'location takchita paris',
      'takchita location 90',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Takchita Ile-de-France',
        description: 'Location de takchitas pour mariages, fiancailles et soirees.',
        path: '/location-takchita-ile-de-france',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Takchita Ile-de-France', path: '/location-takchita-ile-de-france' },
      ]),
    ],
  },
  '/location-karakou-ile-de-france': {
    title: 'Location Karakou Ile-de-France a 100€',
    description:
      "Louez un karakou en Ile-de-France a 100€. SO Caftan propose un service premium de reservation et retrait pour vos evenements.",
    keywords: [
      'location karakou ile de france',
      'location karakou paris',
      'karakou location 100',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Karakou Ile-de-France',
        description: 'Location de karakous pour ceremonies et occasions.',
        path: '/location-karakou-ile-de-france',
        price: 100,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Karakou Ile-de-France', path: '/location-karakou-ile-de-france' },
      ]),
    ],
  },
  '/vente-caftan-ile-de-france': {
    title: 'Vente Caftan Ile-de-France a 180€',
    description:
      "Achetez votre caftan en Ile-de-France au prix fixe de 180€. Collection SO Caftan disponible avec paiement securise.",
    keywords: [
      'vente caftan ile de france',
      'acheter caftan paris',
      'caftan 180',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Vente Caftan Ile-de-France',
        description: 'Vente de caftans de collection a 180€.',
        path: '/vente-caftan-ile-de-france',
        price: 180,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Vente Caftan Ile-de-France', path: '/vente-caftan-ile-de-france' },
      ]),
    ],
  },
  '/location-caftan-mariage': {
    title: 'Location Caftan Mariage Oriental Ile-de-France – des 90€',
    description:
      'Louez votre caftan, takchita ou karakou pour votre mariage oriental en Ile-de-France. SO Caftan : location des 90€, livraison 91/92/93/94. Mariage marocain, algerien, tunisien.',
    keywords: [
      'location caftan mariage',
      'location takchita mariage',
      'tenue mariage oriental ile de france',
      'location robe mariage marocain',
      'caftan mariage pas cher',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Caftan Mariage Oriental',
        description: 'Location de caftans, takchitas et karakous pour mariages orientaux en Ile-de-France.',
        path: '/location-caftan-mariage',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Caftan Mariage', path: '/location-caftan-mariage' },
      ]),
    ],
  },
  '/location-caftan-essonne': {
    title: 'Location Caftan Essonne (91) – Takchita et Karakou des 90€',
    description:
      'SO Caftan a Tigery (91250) : location de takchita 90€ et karakou 100€ en Essonne. Livraison Evry, Corbeil, Massy, Grigny et tout le 91.',
    keywords: [
      'location caftan essonne',
      'location caftan 91',
      'location takchita essonne',
      'location karakou 91',
      'caftan tigery',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Caftan Essonne',
        description: 'Location de takchitas et karakous en Essonne (91). Basee a Tigery.',
        path: '/location-caftan-essonne',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Caftan Essonne', path: '/location-caftan-essonne' },
      ]),
    ],
  },
  '/location-caftan-evry': {
    title: 'Location Caftan Evry-Courcouronnes – Takchita et Karakou des 90€',
    description:
      'Louez un caftan, takchita ou karakou pres d Evry-Courcouronnes. SO Caftan a Tigery (10 min). Livraison Evry, Corbeil, Ris-Orangis, Grigny.',
    keywords: [
      'location caftan evry',
      'location takchita evry',
      'caftan evry-courcouronnes',
      'location robe orientale evry',
      'caftan grand paris sud',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Caftan Evry-Courcouronnes',
        description: 'Location de tenues orientales pres d Evry-Courcouronnes, Essonne.',
        path: '/location-caftan-evry',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Caftan Essonne', path: '/location-caftan-essonne' },
        { name: 'Location Caftan Evry', path: '/location-caftan-evry' },
      ]),
    ],
  },
  '/location-tenue-henna': {
    title: 'Location Tenue Henna Ile-de-France – Takchita et Karakou des 90€',
    description:
      'Louez votre tenue de henna en Ile-de-France : takchita pour henna marocaine (90€), karakou pour henna algerienne (100€). SO Caftan, livraison en IDF.',
    keywords: [
      'location tenue henna',
      'tenue henna mariage',
      'takchita henna location',
      'karakou henna algerienne',
      'robe henne ile de france',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Tenue Henna',
        description: 'Location de takchitas et karakous pour soirees henna en Ile-de-France.',
        path: '/location-tenue-henna',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Tenue Henna', path: '/location-tenue-henna' },
      ]),
    ],
  },
  '/location-caftan-pas-cher': {
    title: 'Location Caftan Pas Cher Ile-de-France – des 90€ | SO Caftan',
    description:
      'Location de caftan pas cher en Ile-de-France : takchita 90€, karakou 100€. Les meilleurs tarifs pour une tenue orientale de qualite. SO Caftan, Tigery (91).',
    keywords: [
      'location caftan pas cher',
      'location takchita pas cher paris',
      'caftan pas cher ile de france',
      'location robe orientale pas cher',
      'caftan petit budget',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildServiceSchema({
        name: 'Location Caftan Pas Cher IDF',
        description: 'Location de tenues orientales aux meilleurs prix en Ile-de-France.',
        path: '/location-caftan-pas-cher',
        price: 90,
      }),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Location Caftan Pas Cher', path: '/location-caftan-pas-cher' },
      ]),
    ],
  },
  '/sur-mesure': {
    title: 'Creation Caftan Sur-Mesure Ile-de-France',
    description:
      "Concevez votre caftan sur-mesure avec SO Caftan en Ile-de-France. Accompagnement, choix des details et creation personnalisee.",
    keywords: [
      'caftan sur mesure ile de france',
      'creation caftan personnalise',
      'caftan sur mesure paris',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Sur-mesure', path: '/sur-mesure' },
      ]),
    ],
  },
  '/cgv': {
    title: 'CGV SO Caftan',
    description: 'Consultez les conditions generales de vente SO Caftan, tarifs, caution et modalites de location/vente.',
    keywords: ['cgv so caftan', 'conditions vente location takchita', 'caution location caftan'],
  },
  '/cgu': {
    title: 'CGU SO Caftan',
    description: "Consultez les conditions generales d'utilisation du site SO Caftan.",
    keywords: ['cgu so caftan', 'conditions utilisation socaftan'],
  },
  '/mentions-legales': {
    title: 'Mentions Legales SO Caftan',
    description: 'Informations legales, editeur, hebergement et contact de SO Caftan.',
    keywords: ['mentions legales so caftan', 'editeur socaftan'],
  },
  '/confidentialite': {
    title: 'Politique de Confidentialite SO Caftan',
    description: 'Politique de confidentialite et traitement des donnees personnelles SO Caftan.',
    keywords: ['confidentialite so caftan', 'rgpd socaftan'],
  },
}

const buildNoIndexConfig = (path) => ({
  title: 'Espace Client',
  description: 'Espace client SO Caftan.',
  keywords: ['espace client so caftan'],
  robots: 'noindex,nofollow',
  path,
  schema: [],
})

const resolveRouteSeo = (pathname) => {
  if (pathname.startsWith('/admin')) return buildNoIndexConfig(pathname)
  if (pathname.startsWith('/compte')) return buildNoIndexConfig(pathname)
  if (pathname.startsWith('/checkout')) return buildNoIndexConfig(pathname)
  if (pathname.startsWith('/connexion')) return buildNoIndexConfig(pathname)
  if (pathname.startsWith('/inscription')) return buildNoIndexConfig(pathname)
  if (pathname.startsWith('/commande-confirmee')) return buildNoIndexConfig(pathname)
  if (pathname === '/politique-confidentialite') return routeSeoMap['/confidentialite']

  return routeSeoMap[pathname] || {
    title: 'Page introuvable',
    description: "La page demandee n'existe pas sur SO Caftan.",
    keywords: ['page introuvable so caftan'],
    robots: 'noindex,nofollow',
    schema: [],
  }
}

const SEOManager = () => {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname || '/'
    const routeSeo = resolveRouteSeo(pathname)
    const path = pathname === '/politique-confidentialite' ? '/confidentialite' : pathname

    applySeo({
      title: routeSeo.title,
      description: routeSeo.description,
      keywords: routeSeo.keywords,
      path,
      image: `${seoConfig.siteUrl}/og-image.png`,
      robots: routeSeo.robots || 'index,follow',
      schema: routeSeo.schema || [],
    })
  }, [location.pathname])

  return null
}

export default SEOManager
