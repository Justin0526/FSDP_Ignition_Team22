const supabase = require('../config/db');

class BranchRepo {
    async getAllBranches() {
        const { data, error } = await supabase
        .from('branches')
        .select('branch_id, name, address, postal_code')
        .eq('is_active', true)
        .order('name', { ascending: true });
        
        if (error) throw new Error(error.message);
        return data || [];
    }

    async getBranchById(branchId) {
        const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();
        
        if (error && error.code !== 'PGRST116') throw new Error(error.message);
        return data;
    }
}

module.exports = new BranchRepo();
