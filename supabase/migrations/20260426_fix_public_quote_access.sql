DROP FUNCTION IF EXISTS check_quote_access(uuid);

CREATE OR REPLACE FUNCTION check_quote_access(token_input uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  record_exists boolean;
  has_pass boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM quotes WHERE public_token = token_input)
  INTO record_exists;

  IF NOT record_exists THEN
    RETURN json_build_object('exists', false, 'requires_password', false);
  END IF;

  SELECT (access_password IS NOT NULL AND access_password <> '')
  INTO has_pass
  FROM quotes
  WHERE public_token = token_input
  LIMIT 1;

  RETURN json_build_object('exists', true, 'requires_password', COALESCE(has_pass, false));
END;
$$;

GRANT EXECUTE ON FUNCTION check_quote_access(uuid) TO anon, authenticated, service_role;

