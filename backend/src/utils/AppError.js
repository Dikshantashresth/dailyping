class AppError extends Error {
    statusCode;
    status;
    isoperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isoperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map