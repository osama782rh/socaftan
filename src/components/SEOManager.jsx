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
    answer: 'Les takchitas sont en location a 90€, les karakous a 100€, avec une caution de 100€ par piece. Les caftans sont disponibles a l\'achat a 180€.',
  },
  {
    question: 'Quel est le prix de vente des caftans ?',
    answer: 'Les caftans de la collection sont proposes a 180€ en vente. Pour la location, optez pour une takchita (90€) ou un karakou (100€).',
  },
  {
    question: 'Dans quelles villes livrez-vous ou organisez-vous le retrait ?',
    answer: "SO Caftan intervient principalement en Ile-de-France : Paris, Essonne (91), Seine-et-Marne, Yvelines, Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94) et Val-d'Oise. Le retrait se fait sur rendez-vous a Tigery (91250).",
  },
  {
    question: 'Combien de temps a l\'avance dois-je reserver ?',
    answer: "Nous recommandons de reserver 3 a 4 semaines avant votre evenement, surtout en haute saison (mai a septembre). Pour les mariages, plus c'est tot, mieux c'est.",
  },
  {
    question: 'La caution est-elle vraiment remboursee ?',
    answer: 'Oui, la caution de 100€ est integralement remboursee apres restitution de la piece en bon etat, sous 3 a 5 jours. Aucun frais cache.',
  },
  {
    question: 'Et si la robe ne me va pas le jour de l\'essayage ?',
    answer: 'Nous etudions les tailles avec vous avant la livraison via WhatsApp. En cas de probleme majeur a la reception, contactez-nous immediatement et nous trouverons une solution.',
  },
  {
    question: 'Puis-je acheter le caftan apres l\'avoir loue ?',
    answer: 'Certaines pieces sont disponibles a la fois en location et a l\'achat. Renseignez-vous via WhatsApp pour le modele qui vous interesse.',
  },
  {
    question: 'Quel mode de paiement acceptez-vous ?',
    answer: 'Nous acceptons les cartes bancaires via Stripe (paiement securise PCI-DSS) et les virements. Le paiement se fait en ligne au moment de la reservation.',
  },
]

const routeSeoMap = {
  '/': {
    title: 'SO Caftan – Location Takchita, Karakou & Vente Caftan en Ile-de-France',
    description:
      "SO Caftan, votre specialiste de la location de takchitas (90€), karakous (100€) et de la vente de caftans (180€) en Ile-de-France. Reservation rapide, paiement securise, livraison 91/92/93/94.",
    keywords: [
      'so caftan',
      'socaftan',
      'so caftan ile de france',
      'location takchita ile de france',
      'location karakou paris',
      'vente caftan 180',
      'boutique caftan ile de france',
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
  '/contact': {
    title: 'Contact SO Caftan – WhatsApp, Telephone, Email',
    description:
      'Contactez SO Caftan pour la location de takchita, karakou ou la vente de caftan en Ile-de-France. WhatsApp +33 1 84 18 03 26, contact@socaftan.fr, Tigery (91250).',
    keywords: [
      'contact so caftan',
      'so caftan whatsapp',
      'so caftan telephone',
      'so caftan tigery',
      'so caftan ile de france contact',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]),
    ],
  },
  '/a-propos': {
    title: 'A propos de SO Caftan – Location de Tenues Orientales en Ile-de-France',
    description:
      'Decouvrez SO Caftan : maison specialisee dans la location de takchita, karakou et la vente de caftan en Ile-de-France. Notre histoire, nos valeurs et notre engagement qualite.',
    keywords: [
      'a propos so caftan',
      'so caftan presentation',
      'so caftan histoire',
      'maison so caftan ile de france',
      'qui est so caftan',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'A propos', path: '/a-propos' },
      ]),
    ],
  },
  '/galerie': {
    title: 'Galerie SO Caftan – Realisations & inspirations en Ile-de-France',
    description:
      'Decouvrez la galerie SO Caftan : takchitas, karakous et caftans portes par nos clientes pour leurs mariages et evenements orientaux en Ile-de-France.',
    keywords: [
      'galerie caftan',
      'realisation takchita',
      'inspiration karakou',
      'photos caftan mariage',
      'so caftan galerie',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Galerie', path: '/galerie' },
      ]),
    ],
  },
  '/quiz': {
    title: 'Quiz – Quelle tenue est faite pour vous ? | SO Caftan',
    description:
      'Decouvrez en 1 minute la takchita, le karakou ou le caftan ideal pour votre mariage, henna ou ceremonie orientale. Quiz personnalise + code promo -20%.',
    keywords: [
      'quiz caftan',
      'quel caftan choisir',
      'quelle takchita pour mariage',
      'quiz mode orientale',
      'tenue mariage personnalisee',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Quiz', path: '/quiz' },
      ]),
    ],
  },
  '/blog': {
    title: 'Blog SO Caftan – Conseils & traditions sur les tenues orientales',
    description:
      'Conseils, traditions et inspirations sur la location et le choix des takchitas, karakous et caftans en Ile-de-France. Le blog SO Caftan.',
    keywords: [
      'blog so caftan',
      'conseils takchita',
      'blog mariage oriental',
      'tradition caftan',
      'tendance caftan',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Blog', path: '/blog' },
      ]),
    ],
  },
  '/blog/choisir-takchita-mariage-marocain': {
    title: 'Comment choisir sa takchita pour un mariage marocain – Guide complet',
    description:
      'Guide complet pour choisir la takchita parfaite pour votre mariage marocain : couleurs, tissus, broderies, traditions et tarifs. SO Caftan.',
    keywords: [
      'choisir takchita mariage marocain',
      'takchita mariage couleurs',
      'guide takchita',
      'takchita mariee',
      'takchita henna',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Choisir sa takchita', path: '/blog/choisir-takchita-mariage-marocain' },
      ]),
    ],
  },
  '/blog/henna-marocaine-vs-algerienne': {
    title: 'Henna marocaine vs algerienne : quelles tenues porter ?',
    description:
      'Differences entre la henna marocaine (takchita verte) et la henna algerienne (karakou, chedda). Quelle tenue porter selon la tradition ?',
    keywords: [
      'henna marocaine algerienne',
      'tenue henna mariage',
      'difference takchita karakou',
      'chedda tlemcen',
      'karakou algerien',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Henna marocaine vs algerienne', path: '/blog/henna-marocaine-vs-algerienne' },
      ]),
    ],
  },
  '/blog/cout-location-caftan-ile-de-france': {
    title: 'Combien coute une location de caftan en Ile-de-France ?',
    description:
      'Tarifs detailles de location de caftan, takchita et karakou en Ile-de-France 2026. Prix, caution, livraison et comparaison achat vs location.',
    keywords: [
      'prix location caftan',
      'tarif location takchita',
      'cout location karakou',
      'caftan ile de france prix',
      'location caftan pas cher',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Cout location caftan IDF', path: '/blog/cout-location-caftan-ile-de-france' },
      ]),
    ],
  },
  '/avis-clients': {
    title: 'Avis Clients SO Caftan – Temoignages verifies en Ile-de-France',
    description:
      'Decouvrez les avis de nos clientes sur SO Caftan : qualite des tenues, service, livraison et caution. Note moyenne 5/5 sur l\'ensemble de nos prestations.',
    keywords: [
      'avis so caftan',
      'temoignage location takchita',
      'avis location caftan',
      'so caftan reviews',
      'so caftan satisfaction',
    ],
    schema: [
      buildLocalBusinessSchema(),
      buildBreadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Avis clients', path: '/avis-clients' },
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
  if (pathname.startsWith('/wishlist/')) return buildNoIndexConfig(pathname) // pages de partage perso, pas d'indexation
  if (pathname === '/galerie/partager') return buildNoIndexConfig(pathname) // formulaire, pas d'indexation
  if (pathname.startsWith('/newsletter/')) return buildNoIndexConfig(pathname) // pages d'etat newsletter, pas d'indexation
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
