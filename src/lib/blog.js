/**
 * Index des articles de blog SO Caftan.
 * Chaque article expose : slug, title, description, publishedAt, readingTime, category, imageKey, excerpt.
 * Le contenu de chaque article est dans son composant React dedie (src/pages/blog/[Slug].jsx).
 */

export const BLOG_POSTS = [
  {
    slug: 'choisir-takchita-mariage-marocain',
    title: 'Comment choisir sa takchita pour un mariage marocain',
    description:
      'Guide complet pour selectionner la takchita parfaite pour votre mariage marocain : couleurs, tissus, broderies, traditions et conseils pratiques.',
    publishedAt: '2026-04-20',
    readingTime: '6 min',
    category: 'Conseils',
    imageKey: 'ANDALOUSE',
    excerpt:
      'La takchita est bien plus qu\'une tenue : c\'est un symbole d\'elegance et d\'heritage. Voici comment trouver le modele qui sublimera votre plus beau jour.',
  },
  {
    slug: 'henna-marocaine-vs-algerienne',
    title: 'Henna marocaine vs algerienne : quelles tenues porter ?',
    description:
      'Decouvrez les differences entre la henna marocaine et la henna algerienne, et choisissez la tenue traditionnelle adaptee : takchita, karakou ou caftan.',
    publishedAt: '2026-04-25',
    readingTime: '5 min',
    category: 'Tradition',
    imageKey: 'JAWHARA',
    excerpt:
      'Chaque tradition a ses codes vestimentaires. Au Maroc, la takchita verte ou doree domine. En Algerie, le karakou regne. Decryptage culture et style.',
  },
  {
    slug: 'cout-location-caftan-ile-de-france',
    title: 'Combien coute une location de caftan en Ile-de-France ?',
    description:
      'Tarifs detailles de location de caftan, takchita et karakou en Ile-de-France : prix, caution, livraison, et comparaison achat vs location.',
    publishedAt: '2026-05-02',
    readingTime: '4 min',
    category: 'Tarifs',
    imageKey: 'EMERAUDE',
    excerpt:
      'Vous hesitez entre achat et location ? On detaille les tarifs reels en Ile-de-France et on calcule le bon choix selon votre situation.',
  },
]

export const findPostBySlug = (slug) => BLOG_POSTS.find((post) => post.slug === slug)
