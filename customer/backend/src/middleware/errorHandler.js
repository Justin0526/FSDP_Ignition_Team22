// Global error handler middleware. Must be registered LAST in app.js
export function errorHandler(err, req, res, next){
    console.error("Error: ", err);

    if(err.statusCode){
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    // Otherwise treat as unexpected internal error
    return res.status(500).json({
        success: false,
        error: "Internal server error",
    })
}