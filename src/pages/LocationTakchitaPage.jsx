import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Quel est le prix de location d une takchita ?',
    answer: 'Le tarif est de 90€ par piece, avec une caution de 100€ appliquee a la location.',
  },
  {
    question: 'Quels delais pour reserver une takchita ?',
    answer: 'Nous conseillons de reserver le plus tot possible, surtout en periode de mariages et ceremonies.',
  },
  {
    question: 'La caution est-elle rendue ?',
    answer:
      "Oui, la caution est rendue apres verification de la piece. Si la piece n est pas restituee dans l etat fourni, la caution peut etre retenue.",
  },
]

const LocationTakchitaPage = () => {
  return (
    <ServiceLandingPage
      badge="Location Takchita Ile-de-France"
      title="Location takchita en Ile-de-France"
      subtitle="SO Caftan vous propose des takchitas soigneusement selectionnees pour vos mariages, fiancailles et grandes occasions."
      price="90€"
      details={['Caution: 100€', 'Duree: 3 a 5 jours', 'Retrait sur rendez-vous']}
      benefits={[
        'Pieces elegantes pour ceremonies et soirees',
        'Accompagnement personnalise pour le choix du modele',
        'Service reactif via WhatsApp Business',
        'Retrait organise en Ile-de-France',
      ]}
      process={[
        'Choisissez votre takchita dans la collection',
        'Confirmez la date de location',
        'Recevez la confirmation et les details de retrait',
        'Restituez la piece a la date prevue',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou', description: 'Karakous en location a 100€.' },
        { href: '/vente-caftan-ile-de-france', title: 'Vente Caftan', description: 'Caftans disponibles a la vente a 150€.' },
        { href: '/sur-mesure', title: 'Caftan Sur-Mesure', description: 'Creation personnalisee selon vos envies.' },
      ]}
    />
  )
}

export default LocationTakchitaPage
