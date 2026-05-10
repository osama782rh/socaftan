/**
 * Quiz "Quelle tenue est faite pour vous ?"
 * ==========================================
 * Algorithme de scoring simple : chaque modele a des "tags" (styles, couleurs,
 * occasions). Les reponses du quiz definissent un profil utilisatrice avec
 * ses preferences. On calcule un score de matching pour chaque produit du
 * catalogue, puis on retourne les 3 meilleurs.
 *
 * Avantages :
 *  - Aucune IA / API externe, 100% local et instantane
 *  - Travaille avec le catalogue dynamique (fetch depuis Supabase)
 *  - Personnalisable : modifier les tags d'un produit cote admin
 */

export const QUIZ_QUESTIONS = [
  {
    id: 'occasion',
    label: 'Pour quelle occasion cherchez-vous votre tenue ?',
    type: 'single',
    options: [
      { value: 'mariage_marocain', label: 'Mariage marocain', emoji: '💍' },
      { value: 'mariage_algerien', label: 'Mariage algerien', emoji: '💍' },
      { value: 'henna', label: 'Soiree henna', emoji: '🌿' },
      { value: 'fiancailles', label: 'Fiancailles', emoji: '💛' },
      { value: 'aid_reception', label: 'Aid / reception', emoji: '✨' },
      { value: 'autre', label: 'Autre evenement', emoji: '🎉' },
    ],
  },
  {
    id: 'role',
    label: 'Vous etes...',
    type: 'single',
    options: [
      { value: 'mariee', label: 'La mariee', emoji: '👰' },
      { value: 'invitee_proche', label: 'Une invitee proche (soeur, mere)', emoji: '💃' },
      { value: 'invitee', label: 'Une invitee', emoji: '🌸' },
    ],
  },
  {
    id: 'style',
    label: 'Quel est votre style ?',
    type: 'single',
    options: [
      { value: 'classique', label: 'Classique et intemporel' },
      { value: 'moderne', label: 'Moderne et tendance' },
      { value: 'glamour', label: 'Glamour et eclatant' },
      { value: 'epure', label: 'Sobre et chic' },
    ],
  },
  {
    id: 'colors',
    label: 'Quelles couleurs vous parlent ?',
    type: 'multiple',
    minSelections: 1,
    maxSelections: 3,
    options: [
      { value: 'rouge', label: 'Rouge / bordeaux', color: '#a92435' },
      { value: 'or_bronze', label: 'Or / bronze', color: '#c9a46b' },
      { value: 'bleu_emeraude', label: 'Bleu / emeraude', color: '#1e6b6e' },
      { value: 'pourpre_violet', label: 'Pourpre / violet', color: '#7d3c8d' },
      { value: 'pastel', label: 'Pastels (rose, lilas, ivoire)', color: '#e8c5d4' },
      { value: 'noir_marine', label: 'Noir / marine', color: '#1a1a2e' },
      { value: 'eclatant', label: 'Eclatant (jaune, magenta, vert)', color: '#f4a261' },
    ],
  },
  {
    id: 'budget',
    label: 'Votre preference budget ?',
    type: 'single',
    options: [
      { value: 'location', label: 'Location (a partir de 90€)', emoji: '👗' },
      { value: 'achat', label: 'Achat (180€)', emoji: '🛍️' },
      { value: 'no_pref', label: 'Pas de preference', emoji: '✨' },
    ],
  },
]

/**
 * Tags hardcodes par modele du catalogue.
 * IMPORTANT : si un nouveau modele est ajoute en admin, il sera ignore par le quiz.
 * Pour le brancher, ajouter ses tags ici. Cle = nom du produit (insensible a la casse).
 */
const PRODUCT_TAGS = {
  'andalouse': {
    occasions: ['mariage_marocain', 'henna', 'fiancailles'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'rouge'],
    type: ['takchita'],
  },
  'jawhara': {
    occasions: ['mariage_marocain', 'henna', 'fiancailles'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'pastel'],
    type: ['takchita', 'caftan'],
  },
  'royale': {
    occasions: ['mariage_algerien', 'fiancailles', 'henna'],
    styles: ['classique', 'glamour'],
    colors: ['bleu_emeraude', 'or_bronze'],
    type: ['karakou'],
  },
  'emeraude': {
    occasions: ['mariage_marocain', 'mariage_algerien', 'aid_reception'],
    styles: ['glamour', 'moderne'],
    colors: ['bleu_emeraude', 'or_bronze'],
    type: ['caftan'],
  },
  'imperial bronze': {
    occasions: ['aid_reception', 'fiancailles', 'autre'],
    styles: ['glamour', 'classique'],
    colors: ['or_bronze', 'eclatant'],
    type: ['caftan'],
  },
  'safran': {
    occasions: ['mariage_marocain', 'aid_reception', 'autre'],
    styles: ['glamour', 'moderne'],
    colors: ['eclatant', 'or_bronze'],
    type: ['caftan'],
  },
  'takchita bleu majeste': {
    occasions: ['mariage_marocain', 'fiancailles'],
    styles: ['classique', 'epure'],
    colors: ['bleu_emeraude', 'or_bronze'],
    type: ['takchita'],
  },
  'karakou imperial': {
    occasions: ['mariage_algerien', 'fiancailles'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'noir_marine'],
    type: ['karakou'],
  },
  'soultana de fes': {
    occasions: ['mariage_marocain', 'henna'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'rouge'],
    type: ['takchita'],
  },
  'lilas': {
    occasions: ['aid_reception', 'autre', 'fiancailles'],
    styles: ['epure', 'moderne'],
    colors: ['pastel', 'pourpre_violet'],
    type: ['caftan'],
  },
  'sfifa royale': {
    occasions: ['mariage_marocain', 'henna'],
    styles: ['classique'],
    colors: ['or_bronze', 'rouge'],
    type: ['takchita'],
  },
  'pourpe': {
    occasions: ['aid_reception', 'autre'],
    styles: ['glamour', 'moderne'],
    colors: ['pourpre_violet', 'rouge'],
    type: ['caftan'],
  },
  'caftan ambre': {
    occasions: ['mariage_marocain', 'aid_reception', 'autre'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'eclatant'],
    type: ['caftan'],
  },
  'azur magenta': {
    occasions: ['aid_reception', 'autre', 'fiancailles'],
    styles: ['moderne', 'glamour'],
    colors: ['bleu_emeraude', 'eclatant'],
    type: ['caftan'],
  },
  'jade': {
    occasions: ['mariage_algerien', 'fiancailles', 'henna'],
    styles: ['classique', 'glamour'],
    colors: ['bleu_emeraude', 'or_bronze'],
    type: ['karakou'],
  },
  'takchita sultana': {
    occasions: ['mariage_marocain', 'fiancailles', 'henna'],
    styles: ['classique', 'glamour'],
    colors: ['or_bronze', 'rouge'],
    type: ['takchita'],
  },
  'takchita nuit royale': {
    occasions: ['mariage_marocain', 'fiancailles'],
    styles: ['glamour', 'classique'],
    colors: ['noir_marine', 'or_bronze'],
    type: ['takchita'],
  },
  'indigo': {
    occasions: ['aid_reception', 'mariage_algerien', 'autre'],
    styles: ['epure', 'moderne'],
    colors: ['bleu_emeraude', 'noir_marine'],
    type: ['caftan'],
  },
}

/**
 * Calcule un score de matching entre les reponses au quiz et un produit.
 * @returns number (0 a 100)
 */
export const computeMatchScore = (answers, product) => {
  const productName = String(product.name || '').toLowerCase().trim()
  const tags = PRODUCT_TAGS[productName]
  if (!tags) return 30 // produit non tagge = score neutre faible

  let score = 0
  let maxScore = 0

  // Occasion : poids 30
  if (answers.occasion) {
    maxScore += 30
    if (tags.occasions?.includes(answers.occasion)) score += 30
  }

  // Style : poids 25
  if (answers.style) {
    maxScore += 25
    if (tags.styles?.includes(answers.style)) score += 25
  }

  // Couleurs : poids 25 (proportionnel au nb de matches sur les preferences)
  if (Array.isArray(answers.colors) && answers.colors.length > 0) {
    maxScore += 25
    const matches = answers.colors.filter((c) => tags.colors?.includes(c)).length
    score += Math.min(25, (matches / answers.colors.length) * 25)
  }

  // Budget / type : poids 20
  if (answers.budget) {
    maxScore += 20
    if (answers.budget === 'no_pref') {
      score += 15 // bonus partiel
    } else {
      // location -> takchita / karakou (qui ont rental_price > 0)
      // achat -> caftan
      const productCanRent = Number(product.price_rent || product.rental_price || 0) > 0
      const productCanBuy = Number(product.price_buy || product.purchase_price || 0) > 0
      if (answers.budget === 'location' && productCanRent) score += 20
      else if (answers.budget === 'achat' && productCanBuy) score += 20
    }
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50
}

/**
 * Retourne les 3 meilleurs produits matchant les reponses.
 * @param answers - reponses au quiz
 * @param products - liste complete des produits (depuis Supabase)
 */
export const recommendProducts = (answers, products = []) => {
  const scored = products
    .filter((p) => p.available !== false)
    .map((p) => ({
      product: p,
      score: computeMatchScore(answers, p),
    }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 3)
}

/**
 * Retourne un titre personnalise base sur les reponses.
 */
export const buildPersonalizedTitle = (answers) => {
  const styleMap = {
    classique: 'classique',
    moderne: 'moderne',
    glamour: 'glamour',
    epure: 'epure',
  }
  const occasionMap = {
    mariage_marocain: 'mariage marocain',
    mariage_algerien: 'mariage algerien',
    henna: 'soiree henna',
    fiancailles: 'fiancailles',
    aid_reception: 'reception',
    autre: 'evenement special',
  }
  const style = styleMap[answers.style] || ''
  const occasion = occasionMap[answers.occasion] || 'evenement'

  return `Votre selection ${style} pour ${occasion}`.trim()
}
