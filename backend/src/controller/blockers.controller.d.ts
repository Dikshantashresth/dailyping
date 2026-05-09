import type { NextFunction, Request, Response } from "express";
export declare const getBlockers: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const resolveBlocker: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=blockers.controller.d.ts.map