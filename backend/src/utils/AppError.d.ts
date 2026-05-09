declare class AppError extends Error {
    statusCode: number;
    status: string;
    isoperational: boolean;
    constructor(message: string, statusCode: number);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map