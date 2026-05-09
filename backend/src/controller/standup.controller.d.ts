import type { NextFunction, Request, Response } from "express";
export declare const submitStandup: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTodaysStandup: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const userHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const history: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const missingStandups: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=standup.controller.d.ts.map