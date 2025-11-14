import branchController from '../../../../../core/controllers/branch.controller';

export async function GET(request, { params }) {
    const req = { 
        method: 'GET',
        params: { id: params.id }
    };
    
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
    
    await branchController.getBranchById(req, res);
    
    return Response.json(responseData, { status: statusCode });
}
