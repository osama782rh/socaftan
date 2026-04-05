import imgAndalouse from '../assets/ANDALOUSE.jpeg'
import imgAzurMagenta from '../assets/AZUR_MAGENTA.jpeg'
import imgCaftanAmbre from '../assets/CAFTAN_AMBRE.jpeg'
import imgEmeraude from '../assets/EMERAUDE.png'
import imgImperialBronze from '../assets/IMPERIAL_BRONZE.png'
import imgIndigo from '../assets/INDIGO.png'
import imgJade from '../assets/JADE.jpeg'
import imgJawhara from '../assets/JAWHARA.jpeg'
import imgKarakouImperial from '../assets/KARAKOU_IMPERIAL.jpeg'
import imgLilas from '../assets/LILAS.png'
import imgPourpe from '../assets/POURPE.jpeg'
import imgRoyale from '../assets/ROYALE.jpeg'
import imgSafran from '../assets/SAFRAN.png'
import imgSfifaRoyale from '../assets/SFIFA_ROYALE.jpeg'
import imgSoultanaDeFes from '../assets/SOULTANA_DE_FES.png'
import imgTakchitaBleuMajeste from '../assets/TAKCHITA_BLEU_MAJESTE.jpeg'
import imgTakchitaNuitRoyale from '../assets/TAKCHITA_NUIT_ROYALE.jpeg'
import imgTakchitaSultana from '../assets/TAKCHITA_SULTANA.jpeg'
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
