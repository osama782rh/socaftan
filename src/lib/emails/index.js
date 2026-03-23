/**
 * SO Caftan - Système d'emails
 * =============================
 *
 * Templates disponibles dans /templates/ :
 *
 * SUPABASE AUTH (à copier dans Dashboard > Authentication > Email Templates) :
 * - signup-otp.html       → Confirm signup     | Subject: "SO Caftan - Votre code de vérification"
 * - password-reset.html   → Reset password     | Subject: "SO Caftan - Réinitialisation de votre mot de passe"
 * - magic-link.html       → Magic Link         | Subject: "SO Caftan - Votre lien de connexion"
 *
 * TRANSACTIONNELS (envoyés via Edge Function send-order-email + Resend) :
 * - order-confirmation.html → Après paiement Stripe (automatique via webhook)
 * - order-status.html       → Mise à jour de statut (appelé manuellement ou via trigger)
 * - welcome.html            → Après vérification du compte
 *
 * SECRETS REQUIS (Supabase Edge Functions > Secrets) :
 * - RESEND_API_KEY        → Clé API Resend
 * - CONTACT_FROM_EMAIL    → "SO Caftan <contact@socaftan.fr>"
 *
 * DÉPLOIEMENT :
 * npx supabase functions deploy send-order-email
 *
 * UTILISATION (depuis le frontend après vérification OTP) :
 * await supabase.functions.invoke('send-order-email', {
 *   body: { type: 'welcome', userId: user.id }
 * })
 */

export const EMAIL_TYPES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_STATUS: 'order-status',
  WELCOME: 'welcome',
}
