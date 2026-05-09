import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            role?: "admin" | "member";
        }
    }
}
export declare const requireRole: (allowedRoles: ("admin" | "member")[]) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=RoleMiddleware.d.ts.map