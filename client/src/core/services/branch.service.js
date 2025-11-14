const branchRepo = require('../repos/branch.repo');

class BranchService {
    async getAllBranches() {
        const branches = await branchRepo.getAllBranches();
        
        return branches.map(branch => ({
        id: branch.branch_id,
        label: branch.name,
        desc: branch.postal_code 
            ? `${branch.address} (${branch.postal_code})`
            : branch.address
        }));
    }

    async getBranchById(branchId) {
        return await branchRepo.getBranchById(branchId);
    }
}

module.exports = new BranchService();
