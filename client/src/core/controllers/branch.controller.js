const branchService = require('../services/branch.service');

class BranchController {
    async getAllBranches(req, res) {
        try {
        const branches = await branchService.getAllBranches();
        
        return res.status(200).json({
            success: true,
            data: branches,
            count: branches.length
        });
        } catch (error) {
        console.error('Error in getAllBranches:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch branches',
            error: error.message
        });
        }
    }

    async getBranchById(req, res) {
        try {
        const { id } = req.params;
        const branch = await branchService.getBranchById(id);
        
        if (!branch) {
            return res.status(404).json({
            success: false,
            message: 'Branch not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: branch
        });
        } catch (error) {
        console.error('Error in getBranchById:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch branch',
            error: error.message
        });
        }
    }
}

module.exports = new BranchController();
