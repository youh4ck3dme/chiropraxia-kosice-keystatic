require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function verifyAuth() {
  const email = 'info@chiropraxiakosice.eu';
  const password = 'admin123';
  
  console.log(`🔐 Verifying login for: ${email}`);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('❌ Login failed:', error.message);
    console.log('\n⚠️  ACTION NEEDED: You need to create this user in Supabase Authentication!');
    console.log(`   Go to: ${process.env.PUBLIC_SUPABASE_URL}/auth/users (or dashboard)`);
    console.log(`   Add user: ${email}`);
    process.exit(1);
  } else {
    console.log('✅ Login SUCCESS! User exists.');
    console.log('   User ID:', data.user.id);
  }
}

verifyAuth();
