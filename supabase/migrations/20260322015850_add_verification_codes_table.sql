CREATE TABLE IF NOT EXISTS verification_codes (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email TEXT NOT NULL,
	code TEXT NOT NULL,
	user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
	type TEXT NOT NULL DEFAULT 'signup' CHECK (type IN ('signup', 'password_reset')),
	expires_at TIMESTAMPTZ NOT NULL,
	used BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup ON verification_codes(email, code, type) WHERE used = FALSE;

ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on verification_codes"
	ON verification_codes FOR ALL
	TO service_role
	USING (true)
	WITH CHECK (true);
