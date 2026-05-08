-- =====================================================================
-- Migration : programme de fidelite SO Caftan
-- =====================================================================
-- Date: 2026-05-09
-- Description: Compte les locations payees de chaque utilisatrice
--              et octroie une location gratuite tous les 5 paliers.
--
-- Regle :
--   - 1 location validee = 1 etoile
--   - 5 etoiles = 1 location offerte (jeton utilisable au prochain checkout)
--   - L'achat de caftan ne compte pas (location only)
--   - Le compteur reset a 0 quand un jeton est utilise
-- =====================================================================

-- Vue calculee : nombre de locations validees par utilisateur
CREATE OR REPLACE VIEW public.user_loyalty_stats AS
SELECT
  o.user_id,
  COUNT(*) FILTER (
    WHERE o.status IN ('paid', 'confirmed', 'preparing', 'ready', 'delivered', 'returned')
      AND COALESCE(o.order_type, 'location') = 'location'
  ) AS total_rentals
FROM public.orders o
WHERE o.user_id IS NOT NULL
GROUP BY o.user_id;

-- Table : jetons de fidelite (1 jeton = 1 location offerte non encore utilisee)
CREATE TABLE IF NOT EXISTS public.loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at TIMESTAMPTZ NULL,
  consumed_order_id UUID NULL REFERENCES public.orders(id) ON DELETE SET NULL,
  threshold_reached INTEGER NOT NULL  -- nombre de locations atteint pour gagner ce jeton (5, 10, 15...)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_user ON public.loyalty_rewards (user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_unconsumed ON public.loyalty_rewards (user_id) WHERE consumed_at IS NULL;

-- RLS : chacune voit ses propres jetons
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own rewards" ON public.loyalty_rewards;
CREATE POLICY "Users can view their own rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger : a chaque commande qui passe en 'paid', verifie si on a atteint un palier de 5
CREATE OR REPLACE FUNCTION public.grant_loyalty_reward_on_paid_order()
RETURNS TRIGGER AS $$
DECLARE
  v_total_rentals INTEGER;
  v_existing_rewards INTEGER;
  v_eligible_rewards INTEGER;
  v_new_rewards INTEGER;
  v_threshold INTEGER;
  i INTEGER;
BEGIN
  -- Ne traiter que les passages en 'paid' (pas les autres transitions)
  IF NEW.status NOT IN ('paid', 'confirmed') THEN
    RETURN NEW;
  END IF;
  IF OLD.status IN ('paid', 'confirmed', 'preparing', 'ready', 'delivered', 'returned') THEN
    -- Deja compte
    RETURN NEW;
  END IF;
  -- Pas un user identifie
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;
  -- Que les locations comptent
  IF COALESCE(NEW.order_type, 'location') <> 'location' THEN
    RETURN NEW;
  END IF;

  -- Compte les locations validees totales pour cet utilisateur (incluant celle-ci)
  SELECT total_rentals INTO v_total_rentals
  FROM public.user_loyalty_stats
  WHERE user_id = NEW.user_id;

  v_total_rentals := COALESCE(v_total_rentals, 0);

  -- Combien de jetons l'utilisateur a deja recu dans le temps (gagnes, peu importe leur consommation)
  SELECT COUNT(*) INTO v_existing_rewards
  FROM public.loyalty_rewards
  WHERE user_id = NEW.user_id;

  -- Combien de jetons devrait avoir cet utilisateur au total (1 par tranche de 5)
  v_eligible_rewards := v_total_rentals / 5;
  v_new_rewards := v_eligible_rewards - v_existing_rewards;

  -- Cree les jetons manquants
  IF v_new_rewards > 0 THEN
    FOR i IN 1..v_new_rewards LOOP
      v_threshold := (v_existing_rewards + i) * 5;
      INSERT INTO public.loyalty_rewards (user_id, threshold_reached)
      VALUES (NEW.user_id, v_threshold);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_grant_loyalty_reward ON public.orders;
CREATE TRIGGER trg_grant_loyalty_reward
  AFTER INSERT OR UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_loyalty_reward_on_paid_order();

COMMENT ON TABLE public.loyalty_rewards IS 'Jetons fidelite (1 jeton = 1 location offerte) gagnes tous les 5 locations payees';
