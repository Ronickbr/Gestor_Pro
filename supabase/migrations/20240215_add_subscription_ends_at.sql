
-- Add subscription_ends_at column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;

-- Update existing profiles to have subscription_ends_at same as trial_ends_at if null
UPDATE profiles SET subscription_ends_at = trial_ends_at WHERE subscription_ends_at IS NULL;
