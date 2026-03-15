import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config({ path: '.env' });

async function verifyDualEmail() {
  console.log('📧 Testing Dual Email Notification (Customer + Clinic Owner)...');

  const config = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  const clinicEmail = process.env.SMTP_CLINIC_EMAIL || process.env.SMTP_USER;
  const testCustomerEmail = 'erikbabcan@gmail.com'; // Using the email from test-email.ts as default test

  console.log('Configuration Check:');
  console.log('- SMTP User:', config.auth.user);
  console.log('- Clinic Owner Email:', clinicEmail);
  console.log('- Test Customer Email:', testCustomerEmail);

  try {
    const transporter = nodemailer.createTransport(config);

    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection successful!');

    const bookingDetails = {
      clientName: 'Test Testovač',
      serviceName: 'Vstupná konzultácia',
      staffName: 'Dr. Martin Kováč',
      date: 'Pondelok, 1. januára 2024',
      time: '10:00',
    };

    // 1. Send to Customer
    console.log(`🔄 Sending confirmation to CUSTOMER: ${testCustomerEmail}...`);
    await transporter.sendMail({
      from: `"Chiropraxia Košice" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: testCustomerEmail,
      subject: '⏳ Prijatá rezervácia - Vstupná konzultácia',
      html: `
                <div style="background-color: #050505; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
                    <h1 style="color: #14b8a6;">Chiropraxia Košice</h1>
                    <h2>Rezervácia prijatá</h2>
                    <p>Ďakujeme za vašu rezerváciu, ${bookingDetails.clientName}. Termín čaká na potvrdenie terapeutom.</p>
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
                    <p><strong>Služba:</strong> ${bookingDetails.serviceName}</p>
                    <p><strong>Dátum:</strong> ${bookingDetails.date} o ${bookingDetails.time}</p>
                    <p><strong>Terapeut:</strong> ${bookingDetails.staffName}</p>
                </div>
            `,
    });
    console.log('✅ Customer email sent!');

    // 2. Send to Clinic Owner
    console.log(`🔄 Sending notification to CLINIC OWNER: ${clinicEmail}...`);
    await transporter.sendMail({
      from: `"Rezervačný systém" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: clinicEmail,
      subject: `📅 Nová rezervácia: ${bookingDetails.clientName} - ${bookingDetails.date}`,
      html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc;">
                    <h2>Nová rezervácia v systéme</h2>
                    <p><strong>Klient:</strong> ${bookingDetails.clientName}</p>
                    <p><strong>Email:</strong> ${testCustomerEmail}</p>
                    <p><strong>Služba:</strong> ${bookingDetails.serviceName}</p>
                    <p><strong>Dátum:</strong> ${bookingDetails.date} o ${bookingDetails.time}</p>
                    <p><strong>Terapeut:</strong> ${bookingDetails.staffName}</p>
                    <p style="color: blue;">Stav: ČAKÁ NA POTVRDENIE</p>
                </div>
            `,
    });
    console.log('✅ Clinic owner email sent!');

    console.log('\n✨ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('Check both inboxes to verify arrival.');
  } catch (error: any) {
    console.error('❌ Error during dual email test:', error.message);
  }
}

verifyDualEmail();
