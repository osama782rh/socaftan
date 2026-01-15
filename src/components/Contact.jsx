import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Sparkles, Clock, MessageCircle } from 'lucide-react'
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici tu pourrais ajouter l'envoi du formulaire vers un backend
    alert('Merci pour votre message ! Nous vous recontacterons très bientôt.')
    setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' })
  }

  const contactInfo = [
    {
      icon: <Phone size={28} />,
      title: 'Téléphone',
      content: '+33 6 12 34 56 78',
      link: 'tel:+33612345678',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: <Mail size={28} />,
      title: 'Email',
      content: 'contact@socaftan.fr',
      link: 'mailto:contact@socaftan.fr',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <MapPin size={28} />,
      title: 'Localisation',
      content: 'Île-de-France, France',
      link: '#',
      gradient: 'from-amber-500 to-yellow-500',
    },
  ]

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white via-rose-50/30 to-white relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-100 to-pink-100 px-6 py-3 rounded-full mb-6"
          >
            <MessageCircle className="text-rose-600" size={20} />
            <span className="text-rose-600 font-semibold">Parlons-en</span>
          </motion.div>
          
          <h2 className="section-title mb-6">
            Contactez-Nous
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question ? Un projet de location ou d'achat ? On est là pour vous aider
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Left: Contact Info - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="block group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${info.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                <div className="relative flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                  >
                    {info.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">
                      {info.title}
                    </h4>
                    <p className="text-gray-600">{info.content}</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Animated Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="text-amber-400" size={28} />
                  <h4 className="font-bold text-white text-xl">
                    Disponibilité
                  </h4>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Lun - Ven</span>
                    <span className="font-semibold text-white">10h - 19h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Samedi</span>
                    <span className="font-semibold text-white">10h - 18h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dimanche</span>
                    <span className="font-semibold text-amber-400">Sur RDV</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form - 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="relative">
              {/* Glow Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />
              
              <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="text-rose-600" size={32} />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Envoyez-nous un Message
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Service souhaité *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="location">Location</option>
                      <option value="achat">Achat</option>
                      <option value="sur-mesure">Sur-Mesure</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="date"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Date de l'événement (si applicable)
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Votre message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez-nous votre projet..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600" />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center space-x-3 py-4 text-white font-bold text-lg">
                    <span>Envoyer le Message</span>
                    <Send size={20} />
                  </span>
                </motion.button>

                {/* Trust Badge */}
                <p className="mt-6 text-center text-sm text-gray-500">
                  🔒 Vos données sont sécurisées et ne seront jamais partagées
                </p>
              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

export default Contact