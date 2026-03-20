require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function verifyAuth() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Missing required environment variables: ADMIN_EMAIL and ADMIN_PASSWORD');
    console.log('   Set them in your .env file or export them before running this script.');
    process.exit(1);
  }

  console.log(`🔐 Verifying login for: ${email}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
