import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Proposez-vous la location de caftan a Evry ?',
    answer:
      'Oui, SO Caftan dessert Evry-Courcouronnes et toute l agglomeration Grand Paris Sud. Nous sommes basees a Tigery, a quelques minutes d Evry.',
  },
  {
    question: 'Comment recuperer ma tenue a Evry ?',
    answer:
      'Vous pouvez opter pour la livraison directement chez vous a Evry-Courcouronnes, ou pour le retrait sur rendez-vous a notre adresse de Tigery (91250), situee a 10 minutes en voiture.',
  },
  {
    question: 'Quels modeles sont disponibles pres d Evry ?',
    answer:
      'Nous proposons des takchitas (90€), des karakous (100€) et des caftans a l achat (180€). Toute la collection est disponible pour les clientes d Evry et alentours.',
  },
  {
    question: 'Y a-t-il des frais de livraison pour Evry ?',
    answer:
      'Contactez-nous via WhatsApp pour connaitre les conditions de livraison a Evry-Courcouronnes et dans les villes proches (Corbeil-Essonnes, Ris-Orangis, Grigny, Lisses).',
  },
  {
    question: 'Louez-vous aussi pour des hennas et des fiancailles a Evry ?',
    answer:
      'Absolument, nos tenues sont parfaites pour tous types d evenements orientaux : mariages, hennas, fiancailles, baptemes, Aid et soirees entre proches.',
  },
]

const LocationCaftanEvryPage = () => {
  return (
    <ServiceLandingPage
      badge="Location Caftan Evry"
      title="Location de caftan a Evry-Courcouronnes"
      subtitle="Vous cherchez une tenue orientale pres d Evry ? SO Caftan est basee a Tigery, a 10 minutes d Evry-Courcouronnes. Takchita, karakou ou caftan : trouvez la robe parfaite pour votre evenement."
      price="des 90€"
      details={['Takchita 90€ · Karakou 100€ · Caftan 180€', 'A 10 min d Evry-Courcouronnes', 'Livraison ou retrait sur rdv']}
      benefits={[
        'Proximite immediate avec Evry-Courcouronnes et Grand Paris Sud',
        'Collection variee de takchitas, karakous et caftans',
        'Livraison a domicile ou retrait rapide a Tigery (91250)',
        'Service WhatsApp pour organiser votre commande facilement',
      ]}
      process={[
        'Parcourez nos modeles sur socaftan.fr',
        'Reservez en ligne ou contactez-nous au +33 1 84 18 03 26',
        'Choisissez livraison a Evry ou retrait a Tigery',
        'Profitez de votre evenement et restituez sous 3 a 5 jours',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-caftan-essonne', title: 'Location Caftan Essonne', description: 'Toutes nos offres dans le 91.' },
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€.' },
        { href: '/location-caftan-mariage', title: 'Caftan Mariage', description: 'Tenue pour votre mariage oriental.' },
        { href: '/vente-caftan-ile-de-france', title: 'Acheter un Caftan', description: 'Caftans a l achat a 180€.' },
      ]}
    />
  )
}

export default LocationCaftanEvryPage
