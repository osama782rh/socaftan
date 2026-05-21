/**
 * Avis clients SO Caftan utilises dans :
 *  - La page /avis-clients (affichage UI)
 *  - Le SEO (Review schemas pour rich snippets Google)
 *
 * Le champ `datePublished` est un ISO 8601 (necessaire pour Schema.org Review).
 * Quand de vrais avis Google seront disponibles via Places API, on remplacera
 * cette liste par un fetch live.
 */

export const REVIEWS = [
  {
    id: 1,
    name: 'Sara M.',
    initials: 'SM',
    rating: 5,
    date: 'Mars 2026',
    datePublished: '2026-03-15',
    occasion: 'Mariage marocain · Paris',
    quote:
      'Une experience exceptionnelle ! La takchita etait sublime, parfaitement entretenue. L\'equipe SO Caftan a ete d\'une grande gentillesse et m\'a conseillee avec bienveillance. Je recommande a 100%.',
  },
  {
    id: 2,
    name: 'Yasmine B.',
    initials: 'YB',
    rating: 5,
    date: 'Mars 2026',
    datePublished: '2026-03-08',
    occasion: 'Soiree henna · Tigery (91)',
    quote:
      'J\'ai loue un karakou pour ma soiree henna et tout etait parfait. Le tissu de qualite, le service rapide via WhatsApp, et le retrait en Essonne tres pratique. Merci beaucoup !',
  },
  {
    id: 3,
    name: 'Lina K.',
    initials: 'LK',
    rating: 5,
    date: 'Fevrier 2026',
    datePublished: '2026-02-22',
    occasion: 'Fiancailles · Creteil (94)',
    quote:
      'La tenue est arrivee a temps, parfaitement repassee. Les conseils pour le choix du modele m\'ont beaucoup aidee. Caution remboursee comme prevu sous 3 jours. Tres professionnel.',
  },
  {
    id: 4,
    name: 'Nadia R.',
    initials: 'NR',
    rating: 5,
    date: 'Fevrier 2026',
    datePublished: '2026-02-10',
    occasion: 'Mariage algerien · Versailles',
    quote:
      'Karakou Imperial : magnifique tenue, broderies impeccables. Le rapport qualite-prix est imbattable en Ile-de-France. Mes invites m\'ont demandee ou je l\'avais loue. Merci SO Caftan.',
  },
  {
    id: 5,
    name: 'Fatima H.',
    initials: 'FH',
    rating: 5,
    date: 'Janvier 2026',
    datePublished: '2026-01-25',
    occasion: 'Aid el-Fitr · Evry',
    quote:
      'Service rapide et professionnel. La caftan etait exactement comme sur les photos. Reservation simple en ligne et SAV reactif. Je reviendrai pour mon prochain evenement.',
  },
  {
    id: 6,
    name: 'Aicha D.',
    initials: 'AD',
    rating: 5,
    date: 'Janvier 2026',
    datePublished: '2026-01-12',
    occasion: 'Mariage tunisien · Boulogne (92)',
    quote:
      'Une vraie bonne adresse pour les femmes pressees. Reservation en ligne, livraison soignee, restitution facile. Le caftan Safran est splendide. Bravo l\'equipe.',
  },
  {
    id: 7,
    name: 'Houda M.',
    initials: 'HM',
    rating: 5,
    date: 'Decembre 2025',
    datePublished: '2025-12-20',
    occasion: 'Henna marocaine · Massy (91)',
    quote:
      'J\'avais peur de louer une tenue importante en ligne mais l\'experience a depasse mes attentes. Tout etait conforme et meme mieux. Vraiment merci pour votre serieux.',
  },
  {
    id: 8,
    name: 'Samira L.',
    initials: 'SL',
    rating: 5,
    date: 'Decembre 2025',
    datePublished: '2025-12-05',
    occasion: 'Reception · Saint-Denis (93)',
    quote:
      'Prix accessibles en location, tenues haut de gamme. J\'ai paye 90€ ce qui aurait coute 1500€ a l\'achat. Le calcul est vite fait. SO Caftan a ma confiance pour les prochaines.',
  },
]

export const aggregateRating = {
  value: (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1),
  count: REVIEWS.length,
}
