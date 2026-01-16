import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'

const CustomPage = lazy(() => import('./pages/CustomPage'))
const Cgv = lazy(() => import('./pages/Cgv'))
const Confidentialite = lazy(() => import('./pages/Confidentialite'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'))

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-600">
    Chargement...
  </div>
)

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-brand-ivory">
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sur-mesure" element={<CustomPage />} />
            <Route path="/cgv" element={<Cgv />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<Confidentialite />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  )
}

export default App
