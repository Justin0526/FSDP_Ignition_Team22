// Simple custom error class for consistent error handling.

export default class AppError extends Error{
    constructor(message, statusCode = 400){
        super(message);
        this.statusCode = statusCode;
    }
}