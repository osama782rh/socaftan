import { motion } from 'framer-motion'

const items = [
  'Caftans d\'exception',
  'Broderies artisanales',
  'Tissus nobles',
  'Créations sur-mesure',
  'Service premium',
  'Finitions impeccables',
]

const Marquee = () => {
  return (
    <div className="bg-brand-ink py-5 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center mx-6 md:mx-10">
            <span className="text-white/30 text-sm md:text-base font-serif italic tracking-wide">{item}</span>
            <span className="ml-6 md:ml-10 text-brand-gold/40 text-xs">&#10022;</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default Marquee
