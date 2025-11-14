export async function getAllBranches() {
    console.log('[branchAPI] getAllBranches called');
    
    try {
        console.log('[branchAPI] Fetching from /api/branches');
        const response = await fetch('/api/branches');
        console.log('[branchAPI] Response status:', response.status);
        
        const data = await response.json();
        console.log('[branchAPI] Response data:', data);
        
        if (!data.success) {
        throw new Error(data.message || 'Failed to fetch branches');
        }
        
        // If data is empty, use fallback
        if (!data.data || data.data.length === 0) {
        console.log('[branchAPI] Database is empty, using fallback branches');
        return [
            { id: 'fallback-1', label: 'Bishan', desc: 'Fallback Branch' },
            { id: 'fallback-2', label: 'Pasir Ris', desc: 'Fallback Branch' },
            { id: 'fallback-3', label: 'Tampines', desc: 'Fallback Branch' }
        ];
        }
        
        console.log('[branchAPI] Returning branches from database:', data.data);
        return data.data;
    } catch (error) {
        console.error('[branchAPI] Error fetching branches:', error);
        
        // Fallback data if API call fails
        const fallback = [
        { id: 'fallback-1', label: 'Bishan', desc: 'Fallback Branch' },
        { id: 'fallback-2', label: 'Pasir Ris', desc: 'Fallback Branch' },
        { id: 'fallback-3', label: 'Tampines', desc: 'Fallback Branch' }
        ];
        
        console.log('[branchAPI] Returning fallback branches due to error:', fallback);
        return fallback;
    }
}

export async function getBranchById(branchId) {
    try {
        const response = await fetch(`/api/branches/${branchId}`);
        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching branch by ID:', error);
        return null;
    }
}
