import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config({ path: '.env' });

async function verifySmtp() {
  console.log('📧 Testing SMTP Configuration...');

  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  console.log('Configuration:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    passLength: config.auth.pass ? config.auth.pass.length : 0,
  });

  try {
    const transporter = nodemailer.createTransport(config);

    console.log('🔄 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verification successful!');

    console.log('🔄 Attempting to send test email to erikbabcan@gmail.com...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'erikbabcan@gmail.com',
      subject: '🔍 Test SMTP Chiropraxia',
      text: 'Ak čítate tento email, SMTP nastavenia sú správne!',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error: any) {
    console.error('❌ SMTP Error:', error.message);
    if (error.response) console.error('Response:', error.response);
    if (error.command) console.error('Command:', error.command);
  }
}

verifySmtp();
