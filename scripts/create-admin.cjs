require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createAdminUser() {
  const email = 'info@chiropraxiakosice.eu';
  const password = 'admin123';
  
  console.log(`🔐 Checking if user exists: ${email}`);
  
  // List users to check existence
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message);
    process.exit(1);
  }
  
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    console.log('✅ User already exists. ID:', existingUser.id);
    // Optionally update password if needed
    // await supabase.auth.admin.updateUserById(existingUser.id, { password: password });
    return;
  }
  
  console.log('🆕 Creating new Admin user...');
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Auto confirm
  });
  
  if (error) {
    console.error('❌ Failed to create user:', error.message);
    process.exit(1);
  }
  
  console.log('✅ Admin user created successfully!');
  console.log('   User ID:', data.user.id);
  console.log('   Email:', data.user.email);
}

createAdminUser();
