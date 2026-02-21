-- ============================================================================
-- CHIROPRAXIA KOŠICE - HEADLESS BOOKING ENGINE
-- Supabase PostgreSQL Schema + RPC Functions
-- ============================================================================
-- Execute this entire script in Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
-- Extension not needed for gen_random_uuid() in PG13+
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SCHEMA: Core Tables
-- ============================================================================

-- Staff members (chiropractors, therapists)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Chiropraktik',
    bio TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services offered
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration_min INTEGER NOT NULL DEFAULT 30,
    buffer_time_min INTEGER NOT NULL DEFAULT 10, -- Cleaning/prep time after appointment
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff availability (recurring weekly schedule)
CREATE TABLE IF NOT EXISTS availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 1 = Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, day_of_week, start_time)
);

-- Schedule exceptions (holidays, sick days, special hours)
CREATE TABLE IF NOT EXISTS schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE, -- NULL = applies to all staff
    exception_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT true, -- true = day off, false = special hours
    start_time TIME, -- Only used if is_closed = false
    end_time TIME,   -- Only used if is_closed = false
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Client information
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    -- Booking details
    staff_id UUID NOT NULL REFERENCES staff(id),
    service_id UUID NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    notes TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES: Optimize slot queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_bookings_date_staff ON bookings(booking_date, staff_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_staff_day ON availability(staff_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_date ON schedule_exceptions(exception_date);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);

-- ============================================================================
-- FUNCTION: get_available_slots
-- The "brain" of the booking system
-- ============================================================================

CREATE OR REPLACE FUNCTION get_available_slots(
    p_date DATE,
    p_service_id UUID,
    p_staff_id UUID DEFAULT NULL -- Optional: filter by specific staff
)
RETURNS TABLE (
    slot_time TIME,
    slot_end_time TIME,
    staff_id UUID,
    staff_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_day_of_week INTEGER;
    v_service_duration INTEGER;
    v_buffer_time INTEGER;
    v_total_duration INTEGER;
    v_slot_interval INTERVAL := '15 minutes'; -- Slot granularity
BEGIN
    -- Get day of week (0 = Sunday in PostgreSQL EXTRACT)
    v_day_of_week := EXTRACT(DOW FROM p_date)::INTEGER;
    
    -- Get service duration and buffer time
    SELECT duration_min, buffer_time_min 
    INTO v_service_duration, v_buffer_time
    FROM services 
    WHERE id = p_service_id AND is_active = true;
    
    IF v_service_duration IS NULL THEN
        RAISE EXCEPTION 'Service not found or inactive';
    END IF;
    
    v_total_duration := v_service_duration + v_buffer_time;
    
    -- Generate available slots
    RETURN QUERY
    WITH 
    -- Get all active staff (optionally filtered)
    active_staff AS (
        SELECT s.id, s.name
        FROM staff s
        WHERE s.is_active = true
        AND (p_staff_id IS NULL OR s.id = p_staff_id)
    ),
    -- Get staff availability for this day of week
    staff_hours AS (
        SELECT 
            a.staff_id,
            a.start_time,
            a.end_time
        FROM availability a
        JOIN active_staff ast ON ast.id = a.staff_id
        WHERE a.day_of_week = v_day_of_week
        -- Exclude staff with closed exceptions on this date
        AND NOT EXISTS (
            SELECT 1 FROM schedule_exceptions se
            WHERE (se.staff_id = a.staff_id OR se.staff_id IS NULL)
            AND se.exception_date = p_date
            AND se.is_closed = true
        )
    ),
    -- Generate all possible time slots
    time_slots AS (
        SELECT 
            sh.staff_id,
            -- Fix for PG17: Cast to timestamp for calculation, then back to time
            ts_start::TIME AS slot_start
        FROM staff_hours sh,
        generate_series(
            (CURRENT_DATE + sh.start_time)::timestamp,
            (CURRENT_DATE + sh.end_time - (v_total_duration || ' minutes')::INTERVAL)::timestamp,
            v_slot_interval
        ) AS ts_start
    ),
    -- Get existing bookings for collision detection
    existing_bookings AS (
        SELECT 
            b.staff_id,
            tstzrange(
                (p_date + b.start_time)::TIMESTAMPTZ,
                (p_date + b.end_time)::TIMESTAMPTZ,
                '[)'
            ) AS booking_range
        FROM bookings b
        WHERE b.booking_date = p_date
        AND b.status NOT IN ('cancelled')
    )
    -- Return available slots (no collision with existing bookings)
    SELECT 
        ts.slot_start AS slot_time,
        (ts.slot_start + (v_total_duration || ' minutes')::INTERVAL)::TIME AS slot_end_time,
        ts.staff_id,
        ast.name AS staff_name
    FROM time_slots ts
    JOIN active_staff ast ON ast.id = ts.staff_id
    WHERE NOT EXISTS (
        -- Collision detection using tstzrange intersection
        SELECT 1 FROM existing_bookings eb
        WHERE eb.staff_id = ts.staff_id
        AND eb.booking_range && tstzrange(
            (p_date + ts.slot_start)::TIMESTAMPTZ,
            (p_date + ts.slot_start + (v_total_duration || ' minutes')::INTERVAL)::TIMESTAMPTZ,
            '[)'
        )
    )
    -- Don't show slots in the past for today
    AND (
        p_date > CURRENT_DATE 
        OR ts.slot_start > CURRENT_TIME + INTERVAL '30 minutes'
    )
    ORDER BY ts.slot_start, ast.name;
END;
$$;

-- ============================================================================
-- FUNCTION: create_booking
-- Safe booking creation with double-booking prevention
-- ============================================================================

CREATE OR REPLACE FUNCTION create_booking(
    p_client_name TEXT,
    p_client_email TEXT,
    p_client_phone TEXT,
    p_staff_id UUID,
    p_service_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking_id UUID;
    v_end_time TIME;
    v_service_duration INTEGER;
    v_buffer_time INTEGER;
    v_conflict_count INTEGER;
BEGIN
    -- Get service duration
    SELECT duration_min, buffer_time_min 
    INTO v_service_duration, v_buffer_time
    FROM services 
    WHERE id = p_service_id AND is_active = true;
    
    IF v_service_duration IS NULL THEN
        RAISE EXCEPTION 'Service not found or inactive';
    END IF;
    
    v_end_time := p_start_time + ((v_service_duration + v_buffer_time) || ' minutes')::INTERVAL;
    
    -- Check for conflicts (double-booking prevention)
    SELECT COUNT(*) INTO v_conflict_count
    FROM bookings b
    WHERE b.staff_id = p_staff_id
    AND b.booking_date = p_booking_date
    AND b.status NOT IN ('cancelled')
    AND tstzrange(
        (p_booking_date + b.start_time)::TIMESTAMPTZ,
        (p_booking_date + b.end_time)::TIMESTAMPTZ,
        '[)'
    ) && tstzrange(
        (p_booking_date + p_start_time)::TIMESTAMPTZ,
        (p_booking_date + v_end_time)::TIMESTAMPTZ,
        '[)'
    );
    
    IF v_conflict_count > 0 THEN
        RAISE EXCEPTION 'Time slot is no longer available';
    END IF;
    
    -- Create the booking
    INSERT INTO bookings (
        client_name,
        client_email,
        client_phone,
        staff_id,
        service_id,
        booking_date,
        start_time,
        end_time,
        notes,
        status
    ) VALUES (
        p_client_name,
        p_client_email,
        p_client_phone,
        p_staff_id,
        p_service_id,
        p_booking_date,
        p_start_time,
        v_end_time,
        p_notes,
        'pending'
    )
    RETURNING id INTO v_booking_id;
    
    RETURN v_booking_id;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for staff (only active)
CREATE POLICY "Public can view active staff"
    ON staff FOR SELECT
    USING (is_active = true);

-- Public read access for services (only active)
CREATE POLICY "Public can view active services"
    ON services FOR SELECT
    USING (is_active = true);

-- Public read access for availability
CREATE POLICY "Public can view availability"
    ON availability FOR SELECT
    USING (true);

-- Public read access for schedule exceptions (for calendar display)
CREATE POLICY "Public can view schedule exceptions"
    ON schedule_exceptions FOR SELECT
    USING (true);

-- Public can create bookings
CREATE POLICY "Public can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (true);

-- Bookings are not publicly readable (privacy)
-- Only service_role or authenticated admin can view
CREATE POLICY "Bookings are private"
    ON bookings FOR SELECT
    USING (false);

-- ============================================================================
-- SEED DATA: Sample data for testing
-- ============================================================================

-- Insert sample staff
INSERT INTO staff (name, role, bio) VALUES
('Dr. Martin Kováč', 'Chiropraktik', 'Špecialista na chrbticu s 15-ročnou praxou'),
('Mgr. Jana Nováková', 'Fyzioterapeut', 'Odborníčka na rehabilitáciu a manuálnu terapiu')
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (name, description, duration_min, buffer_time_min, price, sort_order) VALUES
('Chiropraktická masáž', 'Chiropraxia, klasická masáž, mobilizácia, bankovanie, masážna pištoľ', 50, 10, 49.00, 1),
('Korekcia', 'Chiropraktické ošetrenie, masážna pištoľ, klasická masáž', 15, 5, 25.00, 2),
('Celotelová chiro masáž', 'Klasická masáž, bankovanie, mobilizácia, chiropraxia', 70, 15, 65.00, 3),
('Expresný termín', 'Termín do 2 prac. dní (plus cena služby) / Víkend', 15, 0, 10.00, 4)
ON CONFLICT DO NOTHING;

-- Insert sample availability (Mon-Fri 8:00-17:00)
INSERT INTO availability (staff_id, day_of_week, start_time, end_time)
SELECT 
    s.id,
    dow,
    '08:00'::TIME,
    '17:00'::TIME
FROM staff s
CROSS JOIN generate_series(1, 5) AS dow -- Monday to Friday
ON CONFLICT DO NOTHING;

-- ============================================================================
-- GRANTS: Allow Supabase anon key to execute RPC functions
-- ============================================================================

GRANT EXECUTE ON FUNCTION get_available_slots(DATE, UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION create_booking(TEXT, TEXT, TEXT, UUID, UUID, DATE, TIME, TEXT) TO anon;
