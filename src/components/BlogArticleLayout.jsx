import { Link } from 'react-router-dom'
import { Home, ChevronRight, Calendar, Clock, Tag, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { resolveProductImage } from '../lib/productImages'
import { BLOG_POSTS } from '../lib/blog'

/**
 * Layout commun a tous les articles de blog SO Caftan.
 * Gere : hero, breadcrumb, metadata, CTA WhatsApp, articles relies.
 */
const BlogArticleLayout = ({ post, children }) => {
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <article className="min-h-screen bg-brand-ivory pt-32 md:pt-36 pb-16">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="container-custom px-5 md:px-10 pb-2">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-brand-ink/55">
          <li>
            <Link to="/" className="hover:text-brand-ink inline-flex items-center gap-1">
              <Home size={12} />
              Accueil
            </Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li>
            <Link to="/blog" className="hover:text-brand-ink">Blog</Link>
          </li>
          <ChevronRight size={12} className="text-brand-ink/30" />
          <li className="text-brand-ink font-medium truncate max-w-[200px] md:max-w-none">{post.title}</li>
        </ol>
      </nav>

      {/* Hero article */}
      <header className="container-custom px-5 md:px-10 py-6 md:py-10 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-brand-ink/55 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold font-semibold uppercase tracking-wide">
            <Tag size={11} />
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {new Date(post.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {post.readingTime}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-brand-ink font-serif leading-tight">
          {post.title}
        </h1>

        <p className="mt-5 text-brand-ink/65 text-base md:text-lg leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Image vedette */}
      {post.imageKey && (
        <section className="container-custom px-5 md:px-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-brand-sand/20"
          >
            <img
              src={resolveProductImage(post.imageKey)}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </motion.div>
        </section>
      )}

      {/* Contenu de l'article (markdown-like JSX) */}
      <section className="container-custom px-5 md:px-10 py-8 md:py-12 max-w-3xl">
        <div className="prose-blog">
          {children}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="container-custom px-5 md:px-10 py-6 max-w-3xl">
        <div className="bg-gradient-to-br from-brand-ink via-brand-night to-brand-ink rounded-2xl p-6 md:p-8 text-white">
          <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">Une question sur votre tenue ?</h2>
          <p className="text-white/70 text-sm md:text-base mb-4">
            Notre equipe vous conseille personnellement par WhatsApp pour choisir le modele ideal selon votre evenement.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://wa.me/33184180326?text=Bonjour%20SO%20Caftan%2C%20j%27aurais%20besoin%20d%27un%20conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle size={15} />
              Demander un conseil
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Autres articles */}
      {otherPosts.length > 0 && (
        <section className="container-custom px-5 md:px-10 py-10 max-w-5xl">
          <h2 className="font-serif text-2xl font-bold text-brand-ink mb-5">A lire aussi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherPosts.map((related) => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
                className="group bg-white rounded-2xl border border-brand-sand/60 overflow-hidden hover:border-brand-gold/50 transition-colors"
              >
                {related.imageKey && (
                  <div className="aspect-[16/10] bg-brand-sand/30 overflow-hidden">
                    <img
                      src={resolveProductImage(related.imageKey)}
                      alt={related.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wide">{related.category}</span>
                  <h3 className="text-sm font-semibold text-brand-ink mt-1 leading-snug">{related.title}</h3>
                  <p className="text-xs text-brand-ink/55 mt-2 line-clamp-2">{related.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Retour au blog */}
      <section className="container-custom px-5 md:px-10 py-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-brand-ink/65 hover:text-brand-ink"
        >
          <ArrowLeft size={14} />
          Tous les articles
        </Link>
      </section>
    </article>
  )
}

export default BlogArticleLayout
