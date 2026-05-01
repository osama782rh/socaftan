import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

/**
 * Breadcrumb component - visible navigation aid + SEO signal
 * Renders <nav aria-label="breadcrumb"> with cliccable links
 * @param {Array} items - [{ label: string, to?: string }]
 *   The last item should have no `to` (current page)
 */
const Breadcrumb = ({ items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pt-2 pb-1">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-brand-ink/55">
        <li>
          <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
            <Home size={12} />
            Accueil
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              <ChevronRight size={12} className="text-brand-ink/30" />
              {isLast || !item.to ? (
                <span className="text-brand-ink font-medium" aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.to} className="hover:text-brand-ink">{item.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
