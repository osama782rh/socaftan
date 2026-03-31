import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-28 pb-20 px-5 md:px-10">
      <div className="container-custom max-w-2xl text-center">
        <div className="bg-white border border-brand-sand/60 rounded-3xl p-10 md:p-14">
          <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={28} className="text-brand-ink/60" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-ink mb-3">Page introuvable</h1>
          <p className="text-brand-ink/60 mb-7">
            La page demandee n existe pas ou a ete deplacee. Revenez sur la collection pour continuer votre navigation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-brand-ink text-white px-6 py-3 rounded-full font-semibold text-sm"
            >
              <Home size={16} />
              Retour a l accueil
            </Link>
            <a
              href="/#collection"
              className="inline-flex items-center justify-center gap-2 border border-brand-ink text-brand-ink px-6 py-3 rounded-full font-semibold text-sm"
            >
              Voir la collection
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
