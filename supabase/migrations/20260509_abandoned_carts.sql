-- =====================================================================
-- Migration : tracking des paniers abandonnes pour relance email J+1h
-- =====================================================================
-- Date: 2026-05-09
-- Description: Permet de stocker l'etat du panier des utilisateurs
--              connectes pour pouvoir leur envoyer un email de relance
--              une heure apres l'abandon avec un code promo.
-- =====================================================================

-- Table : un seul panier par utilisateur (le plus recent ecrase l'ancien)
CREATE TABLE IF NOT EXISTS public.user_carts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Tracking des emails de relance
  reminder_email_sent_at TIMESTAMPTZ NULL,
  recovered_at TIMESTAMPTZ NULL  -- la cliente a effectivement passe commande apres relance
);

-- Trigger pour mettre a jour updated_at automatiquement a chaque update
CREATE OR REPLACE FUNCTION public.set_user_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  -- Si on modifie les items, on reset le tracking d'email pour permettre une nouvelle relance
  IF (NEW.items IS DISTINCT FROM OLD.items) THEN
    NEW.reminder_email_sent_at = NULL;
    NEW.recovered_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_cart_updated_at ON public.user_carts;
CREATE TRIGGER trg_user_cart_updated_at
  BEFORE UPDATE ON public.user_carts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_cart_updated_at();

-- RLS : chaque utilisateur ne voit/modifie que son propre panier
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cart" ON public.user_carts;
CREATE POLICY "Users can view their own cart"
  ON public.user_carts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cart" ON public.user_carts;
CREATE POLICY "Users can insert their own cart"
  ON public.user_carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart" ON public.user_carts;
CREATE POLICY "Users can update their own cart"
  ON public.user_carts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cart" ON public.user_carts;
CREATE POLICY "Users can delete their own cart"
  ON public.user_carts FOR DELETE
  USING (auth.uid() = user_id);

-- Index pour le cron (trouve les paniers abandonnes >= 1h sans email envoye)
CREATE INDEX IF NOT EXISTS idx_user_carts_abandonment
  ON public.user_carts (updated_at)
  WHERE reminder_email_sent_at IS NULL
    AND recovered_at IS NULL
    AND items <> '[]'::jsonb;

-- Trigger pour marquer le panier comme 'recovered' quand l'utilisateur passe commande
CREATE OR REPLACE FUNCTION public.mark_cart_recovered_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Quand une nouvelle commande passe en paid/confirmed, on marque le panier comme recupere
  IF NEW.status IN ('paid', 'confirmed') AND (OLD.status IS NULL OR OLD.status NOT IN ('paid', 'confirmed')) THEN
    UPDATE public.user_carts
    SET recovered_at = now(),
        items = '[]'::jsonb
    WHERE user_id = NEW.user_id
      AND reminder_email_sent_at IS NOT NULL
      AND recovered_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mark_cart_recovered ON public.orders;
CREATE TRIGGER trg_mark_cart_recovered
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_cart_recovered_on_order();

COMMENT ON TABLE public.user_carts IS 'Paniers persistes pour la relance email J+1h des paniers abandonnes';
COMMENT ON COLUMN public.user_carts.reminder_email_sent_at IS 'Timestamp d''envoi de l''email de relance (NULL = pas encore envoye)';
COMMENT ON COLUMN public.user_carts.recovered_at IS 'Timestamp ou la cliente a passe commande apres la relance (succes)';
