import type { NextFunction, Request, Response } from "express";
import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError";

export const getBlockers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const teamId = req.params.teamId;
    console.log(teamId)
    const getBlockers = await client.query(
      `SELECT b.*, p.name, p.avatar_url 
       FROM blocker_flags b 
       LEFT JOIN profiles p ON b.user_id = p.id 
       WHERE b.team_id = $1 
       ORDER BY b.last_seen DESC`,
      [teamId],
    );
    if (getBlockers.rows.length == 0)
      return next(new AppError("No blocker found", 404));
    return res.json({
      message: "Request Successful",
      blockers: getBlockers.rows,
      success: true,
    });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};


export const resolveBlocker = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { teamId, blockerId } = req.params;
    const userid = req.userId;
    const role = req.role;


    if (role == "member") throw new AppError("Unauthorized. Only admins can resolve blockers.", 401);

    await client.query("BEGIN");
    
    const blockerExist = await client.query(
      "SELECT * FROM blocker_flags WHERE id=$1 AND team_id=$2",
      [blockerId, teamId],
    );
    
    if (blockerExist.rows.length == 0)
      throw new AppError("Blocker Doesn't Exist", 404);

    const update = await client.query(
      "UPDATE blocker_flags SET resolved = $1, resolved_at = $2, resolved_by = $3 WHERE id = $4 RETURNING *",
      [true, new Date(), userid, blockerId],
    );
    
    if (update.rows.length == 0) throw new AppError("Failed to update", 403);

    await client.query("COMMIT");
    return res.status(200).json({
      message: "Successfully resolved!",
      blocker: update.rows[0],
      success: true,
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
  }
};


