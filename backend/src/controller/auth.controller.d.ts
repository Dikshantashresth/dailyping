import type { NextFunction, Request, Response } from "express";
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getMe: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.controller.d.ts.map