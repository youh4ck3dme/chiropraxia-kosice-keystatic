-- Allow authenticated users (Admin) to view all bookings
DROP POLICY IF EXISTS "Bookings are private" ON bookings;

CREATE POLICY "Authenticated users can view bookings"
ON bookings FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to delete bookings
CREATE POLICY "Authenticated users can delete bookings"
ON bookings FOR DELETE
TO authenticated
USING (true);

-- Ensure only authenticated users can see sensitive client data (already covered by SELECT policy, but good to double check)
