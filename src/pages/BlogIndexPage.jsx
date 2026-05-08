import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight, Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '../lib/blog'
import { resolveProductImage } from '../lib/productImages'

const BlogIndexPage = () => {
  return (
    <div className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pb-2">
        <ol className="flex items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium">Blog</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-12">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold uppercase tracking-wide mb-4">
            Conseils & inspirations
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif mb-4">
            Le blog SO Caftan
          </h1>
          <p className="text-brand-ink/65 text-base md:text-lg leading-relaxed">
            Conseils, traditions, tendances : tout ce qu'il faut savoir pour choisir, porter et entretenir
            une tenue orientale en Ile-de-France.
          </p>
        </div>
      </section>

      {/* Liste articles */}
      <section className="container-custom px-5 md:px-10 pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl border border-brand-sand/60 overflow-hidden hover:border-brand-gold/55 hover:shadow-md transition-all h-full"
              >
                {post.imageKey && (
                  <div className="aspect-[16/10] bg-brand-sand/30 overflow-hidden">
                    <img
                      src={resolveProductImage(post.imageKey)}
                      alt={post.title}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <div className="flex items-center gap-2 text-[11px] text-brand-ink/55 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-semibold uppercase tracking-wide">
                      <Tag size={10} />
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg md:text-xl font-bold text-brand-ink leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-brand-ink/60 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-brand-ink/45 inline-flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-gold font-semibold group-hover:gap-2 transition-all">
                      Lire l'article
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Maillage */}
      <section className="container-custom px-5 md:px-10 py-8">
        <h2 className="font-serif text-xl font-bold text-brand-ink mb-4">Decouvrez nos services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/location-takchita-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Takchita</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 90€</p>
          </Link>
          <Link to="/location-karakou-ile-de-france" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Location Karakou</p>
            <p className="text-xs text-brand-ink/55 mt-1">A partir de 100€</p>
          </Link>
          <Link to="/galerie" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Galerie</p>
            <p className="text-xs text-brand-ink/55 mt-1">Inspirations</p>
          </Link>
          <Link to="/avis-clients" className="bg-white rounded-2xl border border-brand-sand/60 p-4 hover:border-brand-gold transition-colors">
            <p className="font-semibold text-brand-ink">Avis clients</p>
            <p className="text-xs text-brand-ink/55 mt-1">Note 5/5</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogIndexPage
