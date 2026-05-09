export type UUID = string;
export interface AuthRequest extends Request {
    userId?: UUID;
    role?: "admin" | "member";
}
//# sourceMappingURL=authTypes.d.ts.map