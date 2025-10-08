/**
 * Test script to verify rate limiting on authentication routes
 * This script will attempt multiple login requests to test the rate limiter
 */

const axios = require('axios');

async function testRateLimit() {
    console.log('🧪 Testing rate limiting on /login route...');
    
    const attempts = [];
    const baseURL = 'http://localhost:8080';
    
    // Make 6 rapid requests to exceed the 5-request limit
    for (let i = 1; i <= 6; i++) {
        try {
            const response = await axios.post(`${baseURL}/login`, {
                username: 'test-user',
                password: 'wrong-password'
            }, {
                timeout: 5000,
                validateStatus: () => true // Accept all status codes
            });
            
            attempts.push({
                attempt: i,
                status: response.status,
                message: response.status === 429 ? 'Rate limited!' : 'Request allowed'
            });
            
            console.log(`Attempt ${i}: Status ${response.status} - ${response.status === 429 ? '🚫 Rate limited!' : '✅ Request allowed'}`);
            
        } catch (error) {
            attempts.push({
                attempt: i,
                status: 'ERROR',
                message: error.message
            });
            console.log(`Attempt ${i}: Error - ${error.message}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Check results
    const rateLimitedAttempts = attempts.filter(a => a.status === 429);
    
    if (rateLimitedAttempts.length > 0) {
        console.log('\n✅ Rate limiting is working correctly!');
        console.log(`🔒 ${rateLimitedAttempts.length} requests were rate limited`);
    } else {
        console.log('\n⚠️ Rate limiting may not be working as expected');
    }
    
    return attempts;
}

// Only run if called directly
if (require.main === module) {
    testRateLimit().catch(console.error);
}

module.exports = testRateLimit;
