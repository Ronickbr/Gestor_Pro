-- Add missing columns to quotes table for warranty and signature features
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS warranty_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS signature_data TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS contract_number TEXT;
