-- Add missing columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS document text,
ADD COLUMN IF NOT EXISTS avatar text;
