import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Quel est le prix le plus bas pour louer un caftan ?',
    answer:
      'Chez SO Caftan, la location de takchita commence a 90€ et la location de karakou a 100€. Ce sont les tarifs les plus competitifs en Ile-de-France pour des tenues de qualite.',
  },
  {
    question: 'Pourquoi la location est-elle plus avantageuse que l achat ?',
    answer:
      'Un caftan ou une takchita de qualite coute entre 500€ et 2000€ a l achat. Avec SO Caftan, vous portez une tenue d exception pour 90€ a 100€ en location, soit 5 a 20 fois moins cher.',
  },
  {
    question: 'Y a-t-il des frais caches en plus du prix de location ?',
    answer:
      'Non, le tarif de location est fixe : 90€ pour une takchita, 100€ pour un karakou. Seule une caution de 100€ est demandee et integralement remboursee apres restitution de la piece en bon etat.',
  },
  {
    question: 'Proposez-vous des reductions ou des codes promo ?',
    answer:
      'Oui, nous proposons regulierement des offres. Suivez-nous sur Instagram @so_caftan91 ou demandez directement par WhatsApp si un code promo est actif.',
  },
  {
    question: 'La qualite est-elle au rendez-vous malgre les prix bas ?',
    answer:
      'Absolument. Nos tenues sont soigneusement selectionnees et entretenues. Le prix accessible est possible grace a la location : chaque piece est portee plusieurs fois, ce qui nous permet de proposer des tarifs competitifs sans compromis sur la qualite.',
  },
]

const LocationCaftanPasCherPage = () => {
  return (
    <ServiceLandingPage
      badge="Location Caftan Pas Cher"
      title="Location de caftan pas cher en Ile-de-France"
      subtitle="Portez une tenue orientale d exception sans vous ruiner. SO Caftan propose la location de takchitas a 90€ et de karakous a 100€ en Ile-de-France, les tarifs les plus accessibles du marche."
      price="des 90€"
      details={['Takchita: 90€ · le moins cher en IDF', 'Karakou: 100€ · prix competitif', 'Caftan a l achat: 180€ seulement']}
      benefits={[
        'Les tarifs les plus competitifs en Ile-de-France',
        'Qualite premium a prix accessible grace a la location',
        'Caution 100% remboursable apres restitution',
        'Pas de frais caches : prix fixe, sans surprise',
      ]}
      process={[
        'Comparez nos tarifs : takchita 90€, karakou 100€, caftan 180€',
        'Reservez en ligne ou par WhatsApp au +33 1 84 18 03 26',
        'Recevez votre tenue en Ile-de-France ou retirez a Tigery (91)',
        'Restituez et recuperez votre caution integralement',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita 90€', description: 'Notre offre la plus accessible.' },
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou 100€', description: 'Karakou a prix competitif.' },
        { href: '/location-caftan-mariage', title: 'Caftan Mariage', description: 'Tenue pour votre mariage oriental.' },
        { href: '/location-caftan-essonne', title: 'Location Essonne', description: 'Louez pres de chez vous dans le 91.' },
      ]}
    />
  )
}

export default LocationCaftanPasCherPage
