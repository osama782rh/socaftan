export const PRODUCT_IMAGE_KEYS = [
  'ANDALOUSE',
  'AZUR_MAGENTA',
  'CAFTAN_AMBRE',
  'EMERAUDE',
  'IMPERIAL_BRONZE',
  'INDIGO',
  'JADE',
  'JAWHARA',
  'KARAKOU_IMPERIAL',
  'LILAS',
  'POURPE',
  'ROYALE',
  'SAFRAN',
  'SFIFA_ROYALE',
  'SOULTANA_DE_FES',
  'TAKCHITA_BLEU_MAJESTE',
  'TAKCHITA_NUIT_ROYALE',
  'TAKCHITA_SULTANA',
]

export const normalizeImageKey = (value) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '')

