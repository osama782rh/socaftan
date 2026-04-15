import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Ou se trouve SO Caftan en Essonne ?',
    answer:
      'SO Caftan est situee a Tigery (91250), dans le departement de l Essonne. Nous proposons le retrait sur rendez-vous et la livraison dans tout le 91 et les departements voisins.',
  },
  {
    question: 'Quels sont les tarifs de location en Essonne ?',
    answer:
      'La location de takchita est a 90€ et la location de karakou a 100€, avec une caution de 100€ remboursee apres restitution. La vente de caftan est a 180€.',
  },
  {
    question: 'Livrez-vous dans toute l Essonne ?',
    answer:
      'Oui, nous livrons dans les principales villes de l Essonne : Evry-Courcouronnes, Corbeil-Essonnes, Massy, Palaiseau, Savigny-sur-Orge, Grigny, Ris-Orangis, Sainte-Genevieve-des-Bois et environs.',
  },
  {
    question: 'Peut-on essayer la robe avant de louer ?',
    answer:
      'Le retrait se fait sur rendez-vous a Tigery. Contactez-nous via WhatsApp pour organiser un essayage avant votre evenement.',
  },
  {
    question: 'Quels evenements sont couverts par la location ?',
    answer:
      'Nos tenues sont parfaites pour les mariages marocains, algeriens et tunisiens, les hennas, les fiancailles, les baptemes et toutes les celebrations orientales dans le 91.',
  },
]

const LocationCaftanEssonnePage = () => {
  return (
    <ServiceLandingPage
      badge="Location Caftan Essonne (91)"
      title="Location de caftan et takchita en Essonne"
      subtitle="SO Caftan, votre specialiste de la location de tenues orientales dans le 91. Basee a Tigery, nous desservons toute l Essonne : Evry, Corbeil-Essonnes, Massy, Grigny et alentours."
      price="des 90€"
      details={['Takchita 90€ · Karakou 100€ · Caftan 180€', 'Basee a Tigery (91250)', 'Livraison dans tout le 91']}
      benefits={[
        'Situee au coeur de l Essonne a Tigery (91250)',
        'Livraison disponible dans les villes du 91 et departements voisins',
        'Tenues pour mariages, hennas et ceremonies orientales',
        'Reservation rapide via WhatsApp ou en ligne sur socaftan.fr',
      ]}
      process={[
        'Choisissez votre modele dans la collection en ligne',
        'Reservez en ligne ou par WhatsApp (+33 1 84 18 03 26)',
        'Recevez votre tenue a domicile en Essonne ou retirez a Tigery',
        'Restituez la piece sous 3 a 5 jours apres votre evenement',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€.' },
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou', description: 'Karakous en location a 100€.' },
        { href: '/location-caftan-evry', title: 'Location Caftan Evry', description: 'Louez un caftan a Evry-Courcouronnes.' },
        { href: '/location-caftan-mariage', title: 'Caftan Mariage', description: 'Tenue orientale pour votre mariage.' },
      ]}
    />
  )
}

export default LocationCaftanEssonnePage
