import type { Request, Response, NextFunction } from "express";
declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=authmiddleware.d.ts.map