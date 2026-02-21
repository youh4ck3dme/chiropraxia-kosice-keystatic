-- Settings table for storing configuration like opening hours
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings" 
    ON settings FOR SELECT 
    TO authenticated 
    USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings" 
    ON settings FOR UPDATE 
    TO authenticated 
    USING (true);

-- Allow authenticated users to insert settings
CREATE POLICY "Allow authenticated users to insert settings" 
    ON settings FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Allow public to read settings (for booking widget to check opening hours)
CREATE POLICY "Allow public to read settings" 
    ON settings FOR SELECT 
    TO anon 
    USING (true);

-- Insert default opening hours
INSERT INTO settings (key, value) VALUES (
    'opening_hours',
    '{
        "monday": {"open": "08:00", "close": "17:00", "closed": false},
        "tuesday": {"open": "08:00", "close": "17:00", "closed": false},
        "wednesday": {"open": "08:00", "close": "17:00", "closed": false},
        "thursday": {"open": "08:00", "close": "17:00", "closed": false},
        "friday": {"open": "08:00", "close": "17:00", "closed": false},
        "saturday": {"open": "09:00", "close": "13:00", "closed": false},
        "sunday": {"open": "00:00", "close": "00:00", "closed": true}
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;
