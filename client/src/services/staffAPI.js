// aunthentication service for staff members
export async function loginStaff(email, password) {
    console.log('[staffAPI] loginStaff called with:', { email, password: '***' });
    
    try {
        console.log('[staffAPI] Fetching from /api/staff/login');
        
        const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });
        
        console.log('[staffAPI] Response status:', response.status);
        
        const data = await response.json();
        console.log('[staffAPI] Response data:', data);
        
        return data;
    } catch (error) {
        console.error('[staffAPI] Error during login:', error);
        return {
        success: false,
        message: 'Network error. Please try again.',
        };
    }
}
