import imgAndalouse from '../assets/ANDALOUSE.webp'
import imgAzurMagenta from '../assets/AZUR_MAGENTA.webp'
import imgCaftanAmbre from '../assets/CAFTAN_AMBRE.webp'
import imgEmeraude from '../assets/EMERAUDE.webp'
import imgImperialBronze from '../assets/IMPERIAL_BRONZE.webp'
import imgIndigo from '../assets/INDIGO.webp'
import imgJade from '../assets/JADE.webp'
import imgJawhara from '../assets/JAWHARA.webp'
import imgKarakouImperial from '../assets/KARAKOU_IMPERIAL.webp'
import imgLilas from '../assets/LILAS.webp'
import imgPourpe from '../assets/POURPE.webp'
import imgRoyale from '../assets/ROYALE.webp'
import imgSafran from '../assets/SAFRAN.webp'
import imgSfifaRoyale from '../assets/SFIFA_ROYALE.webp'
import imgSoultanaDeFes from '../assets/SOULTANA_DE_FES.webp'
import imgTakchitaBleuMajeste from '../assets/TAKCHITA_BLEU_MAJESTE.webp'
import imgTakchitaNuitRoyale from '../assets/TAKCHITA_NUIT_ROYALE.webp'
import imgTakchitaSultana from '../assets/TAKCHITA_SULTANA.webp'
import { normalizeImageKey } from './productImageKeys'

export const productImageMap = {
  ANDALOUSE: imgAndalouse,
  AZUR_MAGENTA: imgAzurMagenta,
  CAFTAN_AMBRE: imgCaftanAmbre,
  EMERAUDE: imgEmeraude,
  IMPERIAL_BRONZE: imgImperialBronze,
  INDIGO: imgIndigo,
  JADE: imgJade,
  JAWHARA: imgJawhara,
  KARAKOU_IMPERIAL: imgKarakouImperial,
  LILAS: imgLilas,
  POURPE: imgPourpe,
  ROYALE: imgRoyale,
  SAFRAN: imgSafran,
  SFIFA_ROYALE: imgSfifaRoyale,
  SOULTANA_DE_FES: imgSoultanaDeFes,
  TAKCHITA_BLEU_MAJESTE: imgTakchitaBleuMajeste,
  TAKCHITA_NUIT_ROYALE: imgTakchitaNuitRoyale,
  TAKCHITA_SULTANA: imgTakchitaSultana,
}

const fallbackImage = imgAndalouse

export const resolveProductImage = (imageKey) => {
  const normalized = normalizeImageKey(imageKey)
  return productImageMap[normalized] || fallbackImage
}
