-- =====================================================================
-- Migration : table newsletter_subscribers
-- =====================================================================
-- Date: 2026-05-09
-- Description: Capture des emails pour la newsletter SO Caftan,
--              avec consentement, source, et confirmation double opt-in.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NULL,
  source TEXT DEFAULT 'website',
  confirmed BOOLEAN DEFAULT false,
  confirmation_token TEXT NULL,
  unsubscribed_at TIMESTAMPTZ NULL,
  welcome_email_sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribed ON public.newsletter_subscribers (unsubscribed_at) WHERE unsubscribed_at IS NULL;

-- RLS : pas de SELECT public, tout passe par les Edge Functions service_role
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.newsletter_subscribers;
CREATE POLICY "Service role full access"
  ON public.newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.newsletter_subscribers IS 'Inscrits a la newsletter SO Caftan (RGPD compliant, double opt-in)';
