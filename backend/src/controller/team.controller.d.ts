import type { NextFunction, Request, Response } from "express";
export declare const joinTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMembers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTeams: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const leaveteam: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSettings: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTeam: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=team.controller.d.ts.map