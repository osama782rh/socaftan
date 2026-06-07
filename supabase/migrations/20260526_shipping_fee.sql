-- =====================================================================
-- Migration : frais de livraison
-- =====================================================================
-- Date: 2026-05-26
-- Description: Ajoute une colonne shipping_fee sur orders pour tracker
--              les frais de livraison appliques (6,99€ pour livraison IDF,
--              0€ pour retrait sur RDV).
-- =====================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.orders.shipping_fee IS 'Frais de livraison appliques (0€ pour retrait, 6.99€ pour livraison Ile-de-France)';

-- Backfill des commandes existantes : 0€ par defaut (deja fait par DEFAULT)
-- Sauf si on veut backfiller a 6.99€ pour les commandes "delivery" passees :
-- UPDATE public.orders SET shipping_fee = 6.99 WHERE delivery_method = 'delivery' AND shipping_fee = 0;
-- (commente par defaut : on ne modifie pas le passe)
