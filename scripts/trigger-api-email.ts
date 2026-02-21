import dotenv from 'dotenv';
dotenv.config();

const baseUrl = process.env.SITE_URL || 'http://localhost:4322';

async function triggerEmail() {
    console.log('🚀 Triggering Live Email API Endpoint...');
    
    try {
        const response = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: 'test-123',
                clientName: 'Test Testovač (API Test)',
                clientEmail: 'erikbabcan@gmail.com',
                serviceName: 'Fyzioterapia (API Test)',
                staffName: 'Dr. Martin Kováč',
                bookingDate: '2024-03-01',
                startTime: '14:00',
                type: 'created'
            }),
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ API Request successful!');
            console.log('Result:', result);
        } else {
            console.error('❌ API Request failed!');
            console.error('Status:', response.status);
            console.error('Error:', result.error);
        }

    } catch (error: any) {
        console.error('❌ Error triggering API:', error.message);
    }
}

triggerEmail();
