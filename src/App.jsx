import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CartDrawer from './components/CartDrawer'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'

const CustomPage = lazy(() => import('./pages/CustomPage'))
const Cgv = lazy(() => import('./pages/Cgv'))
const Confidentialite = lazy(() => import('./pages/Confidentialite'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'))

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-600">
    Chargement...
  </div>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="bg-brand-ivory">
            <Navbar />
            <CartDrawer />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sur-mesure" element={<CustomPage />} />
                <Route path="/cgv" element={<Cgv />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-confidentialite" element={<Confidentialite />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/compte" element={
                  <ProtectedRoute><AccountPage /></ProtectedRoute>
                } />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/commande-confirmee" element={<OrderSuccessPage />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
