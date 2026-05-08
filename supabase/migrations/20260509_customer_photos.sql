-- =====================================================================
-- Migration : photos clientes (User Generated Content) pour la galerie
-- =====================================================================
-- Date: 2026-05-09
-- Description: Permet aux clientes d'uploader leurs photos qui seront
--              moderees par l'admin avant affichage dans la galerie.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.customer_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Auteur (peut etre anonyme si non connecte)
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_name TEXT NULL,
  submitter_email TEXT NULL,
  -- Contenu
  storage_path TEXT NOT NULL UNIQUE, -- chemin dans le bucket customer-photos
  public_url TEXT NULL,              -- URL publique apres approbation
  caption TEXT NULL,
  occasion TEXT NULL,                 -- mariage, henna, fiancailles, aid, etc.
  product_name TEXT NULL,             -- nom du modele porte (libre)
  -- Moderation
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  moderation_note TEXT NULL,
  approved_at TIMESTAMPTZ NULL,
  approved_by UUID NULL REFERENCES auth.users(id),
  -- Consentement (RGPD + droit a l'image)
  consent_publication BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ NULL,
  -- Tracking
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_photos_status ON public.customer_photos (status);
CREATE INDEX IF NOT EXISTS idx_customer_photos_user ON public.customer_photos (user_id);
CREATE INDEX IF NOT EXISTS idx_customer_photos_approved ON public.customer_photos (approved_at) WHERE status = 'approved';

-- RLS : photos approuvees visibles publiquement, soumissions par utilisateur
ALTER TABLE public.customer_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved photos are public" ON public.customer_photos;
CREATE POLICY "Approved photos are public"
  ON public.customer_photos FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own submissions" ON public.customer_photos;
CREATE POLICY "Users can view their own submissions"
  ON public.customer_photos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can submit photos" ON public.customer_photos;
CREATE POLICY "Users can submit photos"
  ON public.customer_photos FOR INSERT
  WITH CHECK (
    -- Soumission valide : consentement obligatoire
    consent_publication = true
    AND (auth.uid() = user_id OR user_id IS NULL)
  );

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_customer_photo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customer_photo_updated_at ON public.customer_photos;
CREATE TRIGGER trg_customer_photo_updated_at
  BEFORE UPDATE ON public.customer_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_customer_photo_updated_at();

COMMENT ON TABLE public.customer_photos IS 'Photos clientes UGC affichees dans la galerie apres moderation admin';

-- =====================================================================
-- Storage bucket : customer-photos
-- =====================================================================
-- A executer separement OU via le Dashboard Supabase > Storage > Create bucket
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('customer-photos', 'customer-photos', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- Policies a creer manuellement dans Storage:
--   - INSERT autorise pour authenticated (chacun peut uploader)
--   - SELECT autorise pour anon, authenticated (lecture publique)
--   - UPDATE/DELETE reserve au service_role (moderation admin)
-- =====================================================================
