-- Fix get_available_slots for Postgres 17 compatibility
-- Using timestamp casting for generate_series

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
