import type { NextFunction, Request, Response } from "express";
import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError";
import { detectAndFlagBlocker } from "../services/blockerDetection";


export const submitStandup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userId = req.userId;
    const { team_id, did, blockers, has_blocker, for_date } = req.body;
    await client.query("BEGIN");
    const insertStandup = await client.query(
      "INSERT INTO standups(team_id,user_id,did,blockers,has_blocker,for_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [team_id, userId, did, blockers, has_blocker, for_date],
    );
    if (insertStandup.rows.length == 0)
      throw new AppError("Failed to submit", 500);
    if (has_blocker && blockers) {
      detectAndFlagBlocker(team_id, userId!, blockers, for_date);
    }
    await client.query("COMMIT");
    return res.status(200).json({ message: "Pinged", success: true });
  } catch (error) {

    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const getTodaysStandup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { teamId } = req.params;
    const date =
      req.query.date || req.body.date || new Date().toISOString().split("T")[0];

    // Also joining with profiles to get user info
    const getStandup = await client.query(
      `SELECT s.*, p.name as user_name, p.avatar_url 
       FROM standups s 
       JOIN profiles p ON s.user_id = p.id 
       WHERE s.team_id=$1 AND s.for_date=$2`,
      [teamId, date],
    );
    if (getStandup.rows.length == 0)
      return res
        .status(200)
        .json({ message: "Be the first to submit", success: true });

    return res.status(200).json({ standups: getStandup.rows, success: true });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const userHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const history = await client.query(
      "SELECT * FROM standups WHERE user_id=$1 LIMIT $2 OFFSET $3",
      [userId, limit, offset],
    );
    if (history.rows.length == 0)
      return next(new AppError("No standups present", 404));
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const history = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const teamId = req.params.teamId as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filters from query params
    const search = req.query.search as string | undefined;
    const userId = req.query.userId as string | undefined;
    const hasBlocker = req.query.hasBlocker === "true";
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    let query = `
      SELECT s.*, p.name as user_name, p.avatar_url 
      FROM standups s
      JOIN profiles p ON s.user_id = p.id
      WHERE s.team_id=$1`;
    
    const params: Array<string | number> = [teamId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` AND (s.did ILIKE $${paramCount} OR s.blockers ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (userId) {
      paramCount++;
      query += ` AND s.user_id = $${paramCount}`;
      params.push(userId);
    }

    if (hasBlocker) {
      query += ` AND s.has_blocker = true`;
    }

    if (startDate) {
      paramCount++;
      query += ` AND s.for_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND s.for_date <= $${paramCount}`;
      params.push(endDate);
    }

    // Sort by date descending
    query += ` ORDER BY s.for_date DESC`;

    // Add pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM standups s WHERE team_id = $1`;
    const countParams: Array<string | number> = [teamId];
    let countParamCount = 1;

    if (search) {
      countParamCount++;
      countQuery += ` AND (s.did ILIKE $${countParamCount} OR s.blockers ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }
    if (userId) {
      countParamCount++;
      countQuery += ` AND s.user_id = $${countParamCount}`;
      countParams.push(userId);
    }
    if (hasBlocker) countQuery += ` AND s.has_blocker = true`;
    if (startDate) {
      countParamCount++;
      countQuery += ` AND s.for_date >= $${countParamCount}`;
      countParams.push(startDate);
    }
    if (endDate) {
      countParamCount++;
      countQuery += ` AND s.for_date <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const [historyResult, totalResult] = await Promise.all([
      client.query(query, params),
      client.query(countQuery, countParams)
    ]);

    return res.status(200).json({ 
      standups: historyResult.rows, 
      total: parseInt(totalResult.rows[0].count),
      page,
      limit,
      success: true 
    });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};

export const missingStandups = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const teamId = req.params.teamId;
    const date = req.query.date;
    const role = req.role;
    if (role == "member") throw new AppError("Unauthorized", 401);
    const { rows: missing } = await client.query(
      `SELECT tm.user_id, p.name, p.avatar_url, tm.current_streak
   FROM team_members tm
   JOIN profiles p ON p.id = tm.user_id
   WHERE tm.team_id = $1
     AND tm.user_id NOT IN (
       SELECT user_id FROM standups
       WHERE team_id = $1 AND for_date = $2
     )`,
      [teamId, date],
    );
    return res
      .status(200)
      .json({ message: "Sucessfully Loaded", missing: missing, success: true });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};

