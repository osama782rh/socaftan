import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Merci pour votre message. Nous vous recontacterons très bientôt.')
    setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' })
  }

  const contactInfo = [
    { icon: <Phone size={20} />, title: 'Téléphone', content: '06 99 83 29 02', link: 'tel:+33699832902' },
    { icon: <Mail size={20} />, title: 'Email', content: 'contact@socaftan.fr', link: 'mailto:contact@socaftan.fr' },
    { icon: <MapPin size={20} />, title: 'Localisation', content: 'Île-de-France, France', link: '#' },
  ]

  return (
    <section id="contact" className="section-padding bg-brand-mist relative">
      <div className="container-custom">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label justify-center">Contact</p>
          <h2 className="section-title text-center">
            Parlons de <span className="italic font-light">votre projet</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Une question ? Un projet de location ou d'achat ? On est là pour vous aider.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-sand/50 hover:border-brand-gold/30 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-sand flex items-center justify-center text-brand-ink flex-shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-brand-ink/40 uppercase tracking-wide">{info.title}</h4>
                  <p className="text-brand-ink font-medium text-sm">{info.content}</p>
                </div>
              </a>
            ))}

            {/* Availability */}
            <div className="p-5 bg-brand-ink rounded-xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-brand-gold" />
                <h4 className="font-bold font-serif">Disponibilité</h4>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Lun - Ven</span>
                  <span className="font-medium">10h - 19h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Samedi</span>
                  <span className="font-medium">10h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Dimanche</span>
                  <span className="font-medium text-brand-gold">Sur RDV</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-brand-sand/50"
            >
              <h3 className="text-xl font-bold text-brand-ink font-serif mb-6">
                Envoyez-nous un message
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Nom complet *
                  </label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Email *
                  </label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Téléphone *
                  </label>
                  <input
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none"
                    placeholder="06 99 83 29 02"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Service souhaité *
                  </label>
                  <select
                    id="service" name="service"
                    value={formData.service} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="location">Location</option>
                    <option value="achat">Achat</option>
                    <option value="sur-mesure">Sur-Mesure</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="date" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Date de l'événement
                  </label>
                  <input
                    type="date" id="date" name="date"
                    value={formData.date} onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-xs font-semibold text-brand-ink/50 mb-1.5 uppercase tracking-wide">
                    Votre message *
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange} required rows="4"
                    className="w-full px-4 py-3 bg-brand-ivory border border-brand-sand/60 rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition-all outline-none resize-none"
                    placeholder="Décrivez-nous votre projet..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-ink text-white py-3.5 rounded-full font-semibold text-sm hover:bg-brand-ink/90 transition-colors"
              >
                Envoyer le message
                <Send size={16} />
              </button>

              <p className="mt-4 text-center text-[11px] text-brand-ink/30">
                Vos données sont sécurisées et ne seront jamais partagées.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
