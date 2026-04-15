import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Quelle tenue porter pour une soiree henna ?',
    answer:
      'Pour une henna, la takchita est le choix traditionnel au Maroc. Le karakou est la tenue emblematique des hennas algeriennes. SO Caftan propose les deux en location des 90€.',
  },
  {
    question: 'Quelle est la difference entre la tenue de henna et la tenue de mariage ?',
    answer:
      'La henna (ou nuit du henne) precede le mariage. La mariee porte generalement une takchita verte ou doree pour la henna, puis une tenue differente le jour du mariage. Avec SO Caftan, vous pouvez louer deux tenues pour les deux evenements.',
  },
  {
    question: 'Peut-on louer deux tenues pour la henna et le mariage ?',
    answer:
      'Oui, vous pouvez louer plusieurs pieces. Contactez-nous via WhatsApp pour un tarif adapte si vous souhaitez louer une tenue pour la henna et une autre pour le mariage.',
  },
  {
    question: 'Proposez-vous des tenues pour la henna algerienne ?',
    answer:
      'Oui, nous proposons des karakous en location a 100€, la tenue traditionnelle de la henna algerienne. Nos karakous sont ornes de fetla et de broderies traditionnelles.',
  },
  {
    question: 'Combien de temps a l avance reserver pour une henna ?',
    answer:
      'Nous recommandons de reserver 2 a 4 semaines avant votre soiree henna. En haute saison (mai-septembre), reservez le plus tot possible pour garantir la disponibilite de votre modele.',
  },
]

const LocationTenueHennaPage = () => {
  return (
    <ServiceLandingPage
      badge="Location Tenue Henna"
      title="Location de tenue pour votre soiree henna"
      subtitle="La henna est un moment sacre de votre celebration. SO Caftan vous propose des takchitas et karakous pour sublimer votre nuit du henne, que ce soit pour une tradition marocaine ou algerienne."
      price="des 90€"
      details={['Takchita henna: 90€', 'Karakou henna: 100€', 'Caution remboursable: 100€']}
      benefits={[
        'Takchitas pour henna marocaine et karakous pour henna algerienne',
        'Possibilite de louer 2 tenues (henna + mariage)',
        'Livraison en Ile-de-France pour votre soiree',
        'Accompagnement personnalise pour choisir votre tenue de henna',
      ]}
      process={[
        'Choisissez votre tenue de henna dans notre collection',
        'Reservez en ligne ou par WhatsApp en precisant la date de votre henna',
        'Recevez votre tenue avant le jour de la henna',
        'Restituez la piece dans les 3 a 5 jours suivants',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€ pour mariage et henna.' },
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou', description: 'Karakous en location a 100€ pour henna algerienne.' },
        { href: '/location-caftan-mariage', title: 'Caftan Mariage', description: 'Completez votre tenue avec une robe de mariage.' },
        { href: '/vente-caftan-ile-de-france', title: 'Acheter un Caftan', description: 'Caftans a l achat a 180€.' },
      ]}
    />
  )
}

export default LocationTenueHennaPage
