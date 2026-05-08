-- =====================================================================
-- Migration: tracking de l'email de demande d'avis Google
-- =====================================================================
-- Date: 2026-05-07
-- Description: Ajoute les colonnes necessaires pour eviter d'envoyer
--              plusieurs fois la demande d'avis Google a la meme cliente.
-- =====================================================================

-- 1. Colonne pour tracker quand l'email d'avis a ete envoye
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS review_email_sent_at TIMESTAMPTZ NULL;

-- 2. Colonne pour tracker quand la commande a ete passee en "delivered"
--    (sert a calculer J+7 fiable, meme si created_at est antérieur)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ NULL;

-- 3. Index pour acceler les requetes du cron J+7
CREATE INDEX IF NOT EXISTS idx_orders_review_eligibility
  ON public.orders (status, delivered_at)
  WHERE status = 'delivered' AND review_email_sent_at IS NULL;

-- 4. Trigger pour auto-renseigner delivered_at quand status passe a 'delivered'
CREATE OR REPLACE FUNCTION public.set_delivered_at_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status <> 'delivered') THEN
    NEW.delivered_at = COALESCE(NEW.delivered_at, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_delivered_at ON public.orders;
CREATE TRIGGER trg_set_delivered_at
  BEFORE UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_delivered_at_on_status_change();

-- 5. Backfill des commandes deja livrees (pour ne pas les rater au lancement)
UPDATE public.orders
SET delivered_at = COALESCE(delivered_at, created_at)
WHERE status = 'delivered' AND delivered_at IS NULL;

COMMENT ON COLUMN public.orders.review_email_sent_at IS 'Timestamp d''envoi de la demande d''avis Google (NULL = jamais envoye)';
COMMENT ON COLUMN public.orders.delivered_at IS 'Timestamp du passage en statut delivered (calcul J+7 pour email d''avis)';
