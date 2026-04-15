import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Pourquoi louer un caftan pour son mariage ?',
    answer:
      'La location vous permet de porter une piece d exception sans investir un budget important. Nos takchitas et karakous sont soigneusement entretenus et disponibles des 90€ pour sublimer votre mariage.',
  },
  {
    question: 'Quels types de tenues orientales proposez-vous pour un mariage ?',
    answer:
      'Nous proposons des takchitas (location 90€), des karakous (location 100€) et des caftans a l achat (180€). Chaque tenue est adaptee aux mariages, hennas, fiancailles et ceremonies orientales.',
  },
  {
    question: 'Combien de temps a l avance faut-il reserver pour un mariage ?',
    answer:
      'Nous recommandons de reserver au moins 3 a 4 semaines avant votre mariage, surtout en haute saison (mai a septembre). Contactez-nous via WhatsApp pour verifier la disponibilite.',
  },
  {
    question: 'Livrez-vous la tenue pour le jour du mariage ?',
    answer:
      'Oui, nous proposons la livraison en Ile-de-France (departements 91, 92, 93, 94 et Paris). Le retrait sur rendez-vous est egalement possible a Tigery (91250).',
  },
  {
    question: 'La caution est-elle remboursee apres le mariage ?',
    answer:
      'Oui, la caution de 100€ est integralement remboursee apres verification de l etat de la tenue. La restitution se fait sous 3 a 5 jours apres votre evenement.',
  },
]

const LocationCaftanMariagePage = () => {
  return (
    <ServiceLandingPage
      badge="Location Caftan Mariage"
      title="Location de caftan pour votre mariage oriental"
      subtitle="Sublimez votre mariage marocain, algerien ou tunisien avec une tenue orientale d exception. SO Caftan vous accompagne pour trouver la robe parfaite pour le plus beau jour de votre vie."
      price="des 90€"
      details={['Takchita 90€ · Karakou 100€ · Caftan 180€', 'Caution: 100€ (remboursee)', 'Livraison Ile-de-France disponible']}
      benefits={[
        'Collection selectionnee pour mariages et ceremonies orientales',
        'Tenues disponibles pour la mariee, les soeurs et les invitees',
        'Service WhatsApp reactif pour organiser votre essayage',
        'Livraison et retrait en Ile-de-France (91, 92, 93, 94, Paris)',
      ]}
      process={[
        'Parcourez notre collection en ligne sur socaftan.fr',
        'Reservez votre tenue en ligne ou via WhatsApp',
        'Recevez votre robe avant le jour J en Ile-de-France',
        'Restituez la piece dans les 3 a 5 jours suivants',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€ en Ile-de-France.' },
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou', description: 'Karakous en location a 100€ en Ile-de-France.' },
        { href: '/vente-caftan-ile-de-france', title: 'Acheter un Caftan', description: 'Caftans disponibles a l achat a 180€.' },
        { href: '/location-tenue-henna', title: 'Tenue pour Henna', description: 'Louez une tenue pour votre soiree henna.' },
      ]}
    />
  )
}

export default LocationCaftanMariagePage
