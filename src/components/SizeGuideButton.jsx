import { useState } from 'react'
import { Ruler } from 'lucide-react'
import SizeGuideModal from './SizeGuideModal'

/**
 * Bouton qui ouvre le modal "Guide des tailles".
 *
 * Variants visuelles :
 *   - "link" : lien discret en sous-ligne (defaut)
 *   - "outlined" : bouton encadre
 *   - "ghost" : bouton avec hover de fond
 */
const SizeGuideButton = ({ variant = 'link', className = '' }) => {
  const [open, setOpen] = useState(false)

  const baseClasses = {
    link: 'inline-flex items-center gap-1 text-xs text-brand-gold hover:text-brand-ink underline underline-offset-2 transition-colors',
    outlined: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-sand/70 hover:border-brand-gold text-brand-ink/70 hover:text-brand-ink text-xs font-semibold transition-colors',
    ghost: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-brand-sand/30 text-brand-ink/70 hover:text-brand-ink text-xs font-semibold transition-colors',
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${baseClasses[variant] || baseClasses.link} ${className}`}
      >
        <Ruler size={11} />
        Guide des tailles
      </button>
      <SizeGuideModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default SizeGuideButton
