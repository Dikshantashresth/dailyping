import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError";
export const requireRole = (allowedRoles) => {
    return async (req, _res, next) => {
        const client = await clientPool.connect();
        try {
            const userId = req.userId;
            const teamId = req.params.teamId || req.body.teamId;
            if (!userId || !teamId) {
                return next(new AppError("Missing user or team context", 400));
            }
            const result = await client.query(`SELECT role FROM team_members WHERE user_id=$1 AND team_id=$2`, [userId, teamId]);
            if (result.rows.length === 0) {
                return next(new AppError("Not a team member", 403));
            }
            const role = result.rows[0].role;
            req.role = role;
            if (!allowedRoles.includes(role)) {
                return next(new AppError("Forbidden: insufficient permissions", 403));
            }
            next();
        }
        catch (err) {
            next(err);
        }
        finally {
            client.release();
        }
    };
};
//# sourceMappingURL=RoleMiddleware.js.map