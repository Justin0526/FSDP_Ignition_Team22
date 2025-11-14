import branchController from '../../../core/controllers/branch.controller';

export async function GET(request) {
  // Create mock req/res objects compatible with your controller
    const req = { method: 'GET' };
    
    let statusCode = 200;
    let responseData = null;
    
    const res = {
        status: (code) => {
        statusCode = code;
        return res;
        },
        json: (data) => {
        responseData = data;
        return res;
        }
    };
    
    await branchController.getAllBranches(req, res);
    
    return Response.json(responseData, { status: statusCode });
}
