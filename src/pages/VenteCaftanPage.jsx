import ServiceLandingPage from '../components/ServiceLandingPage'

const faq = [
  {
    question: 'Quel est le prix de vente des caftans ?',
    answer: 'Les caftans de la collection sont proposes a un tarif fixe de 180€.',
  },
  {
    question: 'Puis-je essayer avant achat ?',
    answer: 'Nous vous accompagnons pour choisir le modele le plus adapte avant validation de votre commande.',
  },
  {
    question: 'Quels moyens de paiement sont disponibles ?',
    answer: 'Le paiement est securise et effectue en ligne via Stripe.',
  },
]

const VenteCaftanPage = () => {
  return (
    <ServiceLandingPage
      badge="Vente Caftan Ile-de-France"
      title="Vente de caftans en Ile-de-France"
      subtitle="Decouvrez notre collection de caftans en vente au prix fixe de 180€, avec accompagnement personnalise pour votre selection."
      price="180€"
      details={['Vente uniquement', 'Paiement securise Stripe', 'Accompagnement personnalise']}
      benefits={[
        'Prix clair et transparent a 180€',
        'Collection selectionnee pour les grandes occasions',
        'Service client reactif et professionnel',
        'Disponibilite en Ile-de-France',
      ]}
      process={[
        'Choisissez votre caftan prefere',
        'Ajoutez-le au panier en achat',
        'Finalisez votre commande en ligne',
        'Recuperez votre commande selon les modalites convenues',
      ]}
      faq={faq}
      relatedLinks={[
        { href: '/location-takchita-ile-de-france', title: 'Location Takchita', description: 'Takchitas en location a 90€.' },
        { href: '/location-karakou-ile-de-france', title: 'Location Karakou', description: 'Karakous en location a 100€.' },
        { href: '/sur-mesure', title: 'Creation Sur-Mesure', description: 'Concevez votre piece unique.' },
      ]}
    />
  )
}

export default VenteCaftanPage
