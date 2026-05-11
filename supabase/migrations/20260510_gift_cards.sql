-- =====================================================================
-- Migration : cartes cadeaux SO Caftan
-- =====================================================================
-- Date: 2026-05-10
-- Description: Permet l'achat de cartes cadeaux (90, 100, 180€ ou montant
--              libre) qui peuvent etre utilisees sur le site comme moyen
--              de paiement partiel ou total.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Code unique (XXXX-XXXX-XXXX) que la beneficiaire utilise au checkout
  code TEXT NOT NULL UNIQUE,
  -- Montants
  initial_amount NUMERIC(10, 2) NOT NULL CHECK (initial_amount > 0),
  balance NUMERIC(10, 2) NOT NULL CHECK (balance >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  -- Acheteur
  purchaser_name TEXT NULL,
  purchaser_email TEXT NULL,
  purchaser_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Beneficiaire
  recipient_name TEXT NULL,
  recipient_email TEXT NULL,
  personal_message TEXT NULL,
  -- Stripe (paiement de l'achat de la carte)
  stripe_session_id TEXT NULL UNIQUE,
  stripe_payment_intent TEXT NULL,
  -- Statut
  status TEXT NOT NULL DEFAULT 'pending', -- pending | active | partially_used | depleted | expired | cancelled
  -- Expiration (par defaut 1 an)
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 year'),
  -- Tracking
  delivery_date TIMESTAMPTZ NULL, -- pour envoyer plus tard (option future)
  delivered_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON public.gift_cards (code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_status ON public.gift_cards (status);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient_email ON public.gift_cards (recipient_email);

-- Table des utilisations (audit trail) - chaque application d'une carte sur une commande
CREATE TABLE IF NOT EXISTS public.gift_card_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID NOT NULL REFERENCES public.gift_cards(id) ON DELETE CASCADE,
  order_id UUID NULL REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_used NUMERIC(10, 2) NOT NULL CHECK (amount_used > 0),
  used_by_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_card_uses_gc ON public.gift_card_uses (gift_card_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_gift_card_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gift_card_updated_at ON public.gift_cards;
CREATE TRIGGER trg_gift_card_updated_at
  BEFORE UPDATE ON public.gift_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_gift_card_updated_at();

-- RLS : tout passe par les Edge Functions (service_role), aucun acces direct
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_uses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only on gift_cards" ON public.gift_cards;
CREATE POLICY "Service role only on gift_cards"
  ON public.gift_cards FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role only on gift_card_uses" ON public.gift_card_uses;
CREATE POLICY "Service role only on gift_card_uses"
  ON public.gift_card_uses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fonction utilitaire : appliquer une carte cadeau a une commande (atomique)
CREATE OR REPLACE FUNCTION public.apply_gift_card(
  p_code TEXT,
  p_amount NUMERIC,
  p_order_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_card public.gift_cards%ROWTYPE;
  v_amount_to_apply NUMERIC;
BEGIN
  -- Lock la ligne pour eviter les double-usages
  SELECT * INTO v_card
  FROM public.gift_cards
  WHERE code = upper(trim(p_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  IF v_card.status NOT IN ('active', 'partially_used') THEN
    RETURN jsonb_build_object('success', false, 'error', 'inactive_or_used', 'status', v_card.status);
  END IF;

  IF v_card.expires_at < now() THEN
    UPDATE public.gift_cards SET status = 'expired' WHERE id = v_card.id;
    RETURN jsonb_build_object('success', false, 'error', 'expired');
  END IF;

  IF v_card.balance <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'depleted');
  END IF;

  -- Applique min(montant demande, balance disponible)
  v_amount_to_apply := LEAST(p_amount, v_card.balance);

  UPDATE public.gift_cards
  SET balance = balance - v_amount_to_apply,
      status = CASE WHEN balance - v_amount_to_apply <= 0 THEN 'depleted' ELSE 'partially_used' END
  WHERE id = v_card.id;

  INSERT INTO public.gift_card_uses (gift_card_id, order_id, amount_used, used_by_user_id)
  VALUES (v_card.id, p_order_id, v_amount_to_apply, p_user_id);

  RETURN jsonb_build_object(
    'success', true,
    'amount_applied', v_amount_to_apply,
    'remaining_balance', v_card.balance - v_amount_to_apply,
    'gift_card_id', v_card.id
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_gift_card TO service_role;

COMMENT ON TABLE public.gift_cards IS 'Cartes cadeaux SO Caftan - achat via Stripe + utilisation au checkout';
COMMENT ON TABLE public.gift_card_uses IS 'Audit trail : chaque utilisation d''une carte cadeau sur une commande';
