require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log(`Checking connection to: ${supabaseUrl}`);

  // Check Services table
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('count', { count: 'exact', head: true });

  if (servicesError) {
    console.error('❌ Error checking Services table:', servicesError.message);
    if (servicesError.code === '42P01') {
      console.log('⚠️  Table "services" does not exist. Migrations needed!');
    }
  } else {
    console.log('✅ Services table exists.');
  }

  // Check Staff table
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('count', { count: 'exact', head: true });

  if (staffError) {
    console.error('❌ Error checking Staff table:', staffError.message);
  } else {
    console.log('✅ Staff table exists.');
  }
}

verify();
