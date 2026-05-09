import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError.js";
import { detectAndFlagBlocker } from "../services/blockerDetection";
import { success } from "zod";
export const submitStandup = async (req, res, next) => {
    let client;
    try {
        client = await clientPool.connect();
        const userId = req.userId;
        const { team_id, did, blockers, has_blocker, for_date } = req.body;
        await client.query("BEGIN");
        const insertStandup = await client.query("INSERT INTO standups(team_id,user_id,did,blockers,has_blocker,for_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [team_id, userId, did, blockers, has_blocker, for_date]);
        if (insertStandup.rows.length == 0)
            throw new AppError("Failed to submit", 500);
        if (has_blocker && blockers) {
            detectAndFlagBlocker(team_id, blockers, for_date);
        }
        await client.query("COMMIT");
        return res.status(200).json({ message: "Pinged", success: true });
    }
    catch (error) {
        if (client)
            await client.query("ROLLBACK");
        next(error);
    }
    finally {
        if (client)
            client.release();
    }
};
export const getTodaysStandup = async (req, res, next) => {
    let client;
    try {
        client = await clientPool.connect();
        const { teamId } = req.params;
        const date = req.query.date || req.body.date || new Date().toISOString().split("T")[0];
        // Also joining with profiles to get user info
        const getStandup = await client.query(`SELECT s.*, p.name as user_name, p.avatar_url 
       FROM standups s 
       JOIN profiles p ON s.user_id = p.id 
       WHERE s.team_id=$1 AND s.for_date=$2`, [teamId, date]);
        if (getStandup.rows.length == 0)
            return res
                .status(200)
                .json({ message: "Be the first to submit", success: true });
        return res.status(200).json({ standups: getStandup.rows, success: true });
    }
    catch (error) {
        next(error);
    }
    finally {
        if (client)
            client.release();
    }
};
export const userHistory = async (req, res, next) => {
    let client;
    try {
        client = await clientPool.connect();
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const history = await client.query("SELECT * FROM standups WHERE user_id=$1 LIMIT $2 OFFSET $3", [userId, limit, offset]);
        if (history.rows.length == 0)
            return next(new AppError("No standups present", 404));
    }
    catch (error) {
        next(error);
    }
    finally {
        if (client)
            client.release();
    }
};
export const history = async (req, res, next) => {
    let client;
    try {
        client = await clientPool.connect();
        const teamId = req.params.teamId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const date = req.params.date;
        const offset = (page - 1) * limit;
        let query = `
      SELECT s.*, p.name as user_name, p.avatar_url 
      FROM standups s
      JOIN profiles p ON s.user_id = p.id
      WHERE s.team_id=$1`;
        const params = [teamId];
        if (date) {
            query += " AND for_date = $2";
            params.push(date);
            query += " LIMIT $3 OFFSET $4";
        }
        else {
            query += " LIMIT $2 OFFSET $3";
        }
        params.push(limit, offset);
        await client.query("BEGIN");
        const historyResult = await client.query(query, params);
        await client.query("COMMIT");
        if (historyResult.rows.length == 0)
            return next(new AppError("No standups present", 404));
        return res
            .status(200)
            .json({ standups: historyResult.rows, success: true });
    }
    catch (error) {
        if (client)
            await client.query("ROLLBACK");
        next(error);
    }
    finally {
        if (client)
            client.release();
    }
};
export const missingStandups = async (req, res, next) => {
    let client;
    try {
        client = await clientPool.connect();
        const teamId = req.params.teamId;
        const date = req.query.date;
        const role = req.role;
        if (role == "member")
            throw new AppError("Unauthorized", 401);
        const { rows: missing } = await client.query(`SELECT tm.user_id, p.name, p.avatar_url, tm.current_streak
   FROM team_members tm
   JOIN profiles p ON p.id = tm.user_id
   WHERE tm.team_id = $1
     AND tm.user_id NOT IN (
       SELECT user_id FROM standups
       WHERE team_id = $1 AND for_date = $2
     )`, [teamId, date]);
        return res
            .status(200)
            .json({ message: "Sucessfully Loaded", missing: missing, success: true });
    }
    catch (error) {
        next(error);
    }
    finally {
        if (client)
            client.release();
    }
};
//# sourceMappingURL=standup.controller.js.map