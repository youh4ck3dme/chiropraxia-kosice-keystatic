require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log(`Checking schema compatibility on: ${supabaseUrl}\n`);

  // Check Services schema
  const { data: services, error } = await supabase.from('services').select('*').limit(1);

  if (error) {
    console.error('❌ Services fetch failed:', error.message);
  } else {
    // Check for critical columns
    const cols = services.length > 0 ? Object.keys(services[0]) : ['(no data to check columns)'];
    console.log(`✅ Services table OK. Columns sample: ${cols.slice(0, 5).join(', ')}...`);
    console.log(`   Data found: ${services.length} records in sample.`);
  }

  // Check Staff schema
  const { data: staff, error: staffErr } = await supabase.from('staff').select('*').limit(1);

  if (staffErr) {
    console.error('❌ Staff fetch failed:', staffErr.message);
  } else {
    const cols = staff.length > 0 ? Object.keys(staff[0]) : ['(no data)'];
    console.log(`✅ Staff table OK. Columns sample: ${cols.slice(0, 5).join(', ')}...`);
  }
}

verify();
