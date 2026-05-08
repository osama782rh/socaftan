-- =====================================================================
-- Cron J+7 : envoi automatique des demandes d'avis Google
-- =====================================================================
-- Date: 2026-05-09
-- Description: Configure pg_cron pour appeler quotidiennement la fonction
--              send-review-request en mode batch.
--
-- PREREQUIS:
--   - La migration 20260507_add_review_email_tracking.sql doit etre appliquee
--   - L'Edge Function send-review-request doit etre deployee
--   - Le secret CRON_SECRET doit etre defini dans Vault (voir etape 1 ci-dessous)
--   - Le secret GOOGLE_REVIEW_URL doit etre defini cote Edge Function
-- =====================================================================

-- 1. Activer les extensions necessaires (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Stocker le CRON_SECRET dans Vault
--    A executer SEPAREMENT (pas dans le meme run que ce script) avec votre vraie valeur :
--
--    SELECT vault.create_secret(
--      '<COLLER_ICI_LA_VALEUR_DE_CRON_SECRET>',
--      'cron_secret',
--      'Secret partage avec le cron pour appeler send-review-request en mode batch'
--    );
--
--    Si le secret existe deja, le mettre a jour :
--    SELECT vault.update_secret(
--      (SELECT id FROM vault.secrets WHERE name = 'cron_secret'),
--      '<NOUVELLE_VALEUR>'
--    );

-- 3. Helper SQL : appel HTTP a la fonction send-review-request
CREATE OR REPLACE FUNCTION public.trigger_review_email_batch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_url text := 'https://pedhhhhkqovqezipqwxb.supabase.co/functions/v1/send-review-request';
  v_secret text;
BEGIN
  -- Recupere le secret depuis Vault
  SELECT decrypted_secret
  INTO v_secret
  FROM vault.decrypted_secrets
  WHERE name = 'cron_secret'
  LIMIT 1;

  IF v_secret IS NULL THEN
    RAISE WARNING 'cron_secret introuvable dans Vault, abandon de l''envoi des emails d''avis';
    RETURN;
  END IF;

  -- Appel async, ne bloque pas
  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', v_secret
    ),
    body := jsonb_build_object('mode', 'batch')
  );
END;
$$;

COMMENT ON FUNCTION public.trigger_review_email_batch IS
  'Appele quotidiennement par pg_cron pour envoyer les demandes d''avis Google a J+7';

-- 4. Schedule : tous les jours a 10h00 UTC (12h Paris en ete, 11h en hiver)
-- Si un job du meme nom existe deja, on l'unschedule d'abord pour rejouer proprement
DO $$
DECLARE
  v_jobid bigint;
BEGIN
  SELECT jobid INTO v_jobid
  FROM cron.job
  WHERE jobname = 'send-review-emails-daily';

  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
END $$;

SELECT cron.schedule(
  'send-review-emails-daily',
  '0 10 * * *',
  $$ SELECT public.trigger_review_email_batch(); $$
);

-- 5. Verifier que le job est bien planifie
-- Apres execution, lance :
--   SELECT * FROM cron.job WHERE jobname = 'send-review-emails-daily';
-- Pour voir l'historique des runs :
--   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
