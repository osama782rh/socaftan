import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Quel est le prix de location d un karakou ?',
    answer: 'Le tarif est de 100€ par karakou, avec une caution de 100€ par piece.',
  },
  {
    question: 'Ou se fait le retrait du karakou ?',
    answer: 'Le retrait est organise sur rendez-vous en Ile-de-France selon vos disponibilites.',
  },
  {
    question: 'Peut-on reserver plusieurs pieces ?',
    answer: 'Oui, vous pouvez reserver plusieurs pieces en fonction des disponibilites de la collection.',
  },
]

const LocationKarakouPage = () => {
  return (
    <ServiceLandingPage
      badge="Location Karakou Ile-de-France"
      title="Location karakou en Ile-de-France"
      subtitle="SO Caftan propose des karakous pour vos evenements avec un accompagnement complet de la reservation jusqu au retour."
      price="100€"
      details={['Caution: 100€', 'Duree: 3 a 5 jours', 'Retrait sur rendez-vous']}
      benefits={[
        'Selection de karakous elegants et modernes',
        'Conseil personnalise selon votre evenement',
        'Prise en charge rapide par WhatsApp Business',
        'Paiement securise en ligne',
      ]}
      process={[
        'Selectionnez votre karakou',
        'Choisissez la date de retrait',
        'Finalisez la reservation et le paiement',
        'Retournez la piece dans l etat fourni',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€.' },
        { href: '/vente-caftan-ile-de-france', title: 'Vente Caftan', description: 'Caftans disponibles a la vente a 150€.' },
        { href: '/#contact', title: 'Contact', description: 'Parlez-nous de votre besoin en direct.' },
      ]}
    />
  )
}

export default LocationKarakouPage
