-- =====================================================================
-- Migration : tracking des factures Stripe
-- =====================================================================
-- Date: 2026-05-11
-- Description: Ajoute les colonnes pour stocker les references de
--              factures Stripe (PDF + URL hostee) generees automatiquement
--              apres chaque paiement.
-- =====================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT NULL,
  ADD COLUMN IF NOT EXISTS stripe_invoice_pdf_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS stripe_invoice_hosted_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS stripe_invoice_number TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_stripe_invoice ON public.orders (stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;

COMMENT ON COLUMN public.orders.stripe_invoice_id IS 'ID Stripe de la facture (in_xxx)';
COMMENT ON COLUMN public.orders.stripe_invoice_pdf_url IS 'URL directe du PDF de la facture (signed, expire avec le temps - regenerer via API si besoin)';
COMMENT ON COLUMN public.orders.stripe_invoice_hosted_url IS 'URL de la page hostee Stripe (permanente)';
COMMENT ON COLUMN public.orders.stripe_invoice_number IS 'Numero de facture sequentiel Stripe (visible dans la facture, ex INV-0001)';
