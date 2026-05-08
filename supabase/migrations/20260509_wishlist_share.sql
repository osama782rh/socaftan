-- =====================================================================
-- Migration : partage de wishlist par lien public
-- =====================================================================
-- Date: 2026-05-09
-- Description: Ajoute une colonne wishlist_share_token a la table profiles
--              pour permettre le partage de wishlist via un lien public.
--              Permet aussi de regenerer le token (revoque l'ancien lien).
-- =====================================================================

-- 1. Colonne share token sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wishlist_share_token TEXT UNIQUE;

-- 2. Index pour acceler le lookup public
CREATE INDEX IF NOT EXISTS idx_profiles_wishlist_share_token
  ON public.profiles (wishlist_share_token)
  WHERE wishlist_share_token IS NOT NULL;

-- 3. Vue publique : permet a quiconque ayant le token d'acceder a la wishlist
--    READ-ONLY (un visiteur ne peut rien modifier)
CREATE OR REPLACE VIEW public.shared_wishlists AS
SELECT
  p.wishlist_share_token AS token,
  p.first_name AS owner_first_name,
  w.id AS wishlist_item_id,
  w.product_id,
  w.created_at AS added_at,
  pr.name AS product_name,
  pr.category AS product_category,
  pr.image_key AS product_image_key,
  pr.rental_price AS product_rental_price,
  pr.purchase_price AS product_purchase_price,
  pr.description AS product_description
FROM public.profiles p
INNER JOIN public.wishlist w ON w.user_id = p.id
INNER JOIN public.products pr ON pr.id = w.product_id
WHERE p.wishlist_share_token IS NOT NULL;

-- 4. Politique : permet a tout le monde (anon) de SELECT sur la vue
GRANT SELECT ON public.shared_wishlists TO anon, authenticated;

-- 5. Fonction RPC pour generer/regenerer le token de partage de l'utilisateur connecte
CREATE OR REPLACE FUNCTION public.regenerate_wishlist_share_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentification requise';
  END IF;

  -- Genere un token aleatoire de 32 caracteres
  new_token := encode(gen_random_bytes(16), 'hex');

  UPDATE public.profiles
  SET wishlist_share_token = new_token
  WHERE id = auth.uid();

  RETURN new_token;
END;
$$;

-- 6. Fonction RPC pour revoquer le partage
CREATE OR REPLACE FUNCTION public.revoke_wishlist_share_token()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentification requise';
  END IF;

  UPDATE public.profiles
  SET wishlist_share_token = NULL
  WHERE id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.regenerate_wishlist_share_token TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_wishlist_share_token TO authenticated;

COMMENT ON COLUMN public.profiles.wishlist_share_token IS 'Token unique permettant le partage public de la wishlist (NULL = partage desactive)';
