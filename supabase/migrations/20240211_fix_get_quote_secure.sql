DROP FUNCTION IF EXISTS get_quote_secure(uuid, text);

CREATE OR REPLACE FUNCTION get_quote_secure(token_input uuid, password_input text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'id', q.id,
    'number', q.number,
    'status', q.status,
    'date', q.date,
    'validUntil', q.valid_until,
    'warrantyDuration', q.warranty_duration,
    'paymentTerms', q.payment_terms,
    'services', q.services,
    'materials', q.materials,
    'totalValue', q.total_value,
    'companyInfo', q.company_info,
    'contractNumber', q.contract_number,
    'completionDate', q.completion_date,
    'warrantyUntil', q.warranty_until,
    'signatureData', q.signature_data,
    'viewedAt', q.viewed_at,
    'publicToken', q.public_token,
    'contractTerms', coalesce(ct.content, q.contract_terms),
    'client', CASE WHEN c.id IS NULL THEN NULL ELSE json_build_object(
      'id', c.id,
      'name', c.name,
      'document', c.document,
      'address', c.address,
      'phone', c.phone,
      'email', c.email,
      'avatar', c.avatar
    ) END
  )
  INTO result
  FROM quotes q
  LEFT JOIN clients c ON q.client_id = c.id
  LEFT JOIN contracts ct ON ct.quote_id = q.id
  WHERE q.public_token = token_input
  AND (
    (q.access_password IS NULL OR q.access_password = '')
    OR
    (q.access_password = password_input)
  );

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_quote_secure(uuid, text) TO anon, authenticated, service_role;
