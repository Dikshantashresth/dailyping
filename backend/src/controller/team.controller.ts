import type { NextFunction, Request, Response } from "express";
import slugify from "slugify";
import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError";
import { createTeamSchema } from "../schemas/team.schema";
import { nanoid } from "nanoid";

export const joinTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { id } = req.params;
    const userid = req.userId;
    await client.query("BEGIN");
    const teamExist = await client.query(
      "SELECT * FROM teams WHERE invite_id = $1",
      [id],
    );
    if (teamExist.rows.length == 0)
      throw new AppError("Team Doesnt Exist", 404);
    const teamData = teamExist.rows[0];

    const jointeam = await client.query(
      "INSERT INTO team_members(team_id,user_id,role,current_streak,longest_streaK) VALUES($1,$2,$3,$4,$5) ON CONFLICT(team_id,user_id) DO NOTHING RETURNING * ",
      [teamData.id, userid, "member", 0, 0],
    );
    console.log(jointeam)
    if (jointeam.rows.length == 0) throw new AppError("Failed to join", 500);

    await client.query("COMMIT");
    res.status(200).json({ message: "Joined Successfully", success: true });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    next(error);
  } finally {
    if (client) client.release();
  }
};


export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { teamId } = req.params;
    const members = await client.query(
      `SELECT tm.role, tm.current_streak, tm.longest_streak,p.avatar_url,p.name, p.email 
       FROM team_members tm 
       JOIN profiles p ON tm.user_id = p.id 
       WHERE tm.team_id = $1`,
      [teamId],
    );

    res.status(200).json({ members: members.rows, success: true });
  } catch (error) {

    next(error);
  } finally {
    if (client) client.release();
  }
};


export const getTeams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userid = req.userId;
    if (!userid) {
      throw new AppError("Unauthorized - missing user", 401);
    }
    const result = await client.query(
      `SELECT 
        t.id,
        t.name,
        t.invite_id,
        t.slug,
        t.timezone,
        t.submission_open,
        t.submission_close,
        t.reminder_time,
        t.created_at,
        tm.role,
        tm.current_streak,
        tm.longest_streak
      FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      WHERE tm.user_id = $1
      ORDER BY t.created_at DESC`,
      [userid],
    );

    return res.json({
      success: true,
      teams: result.rows,
    });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};


export const leaveteam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { teamid } = req.params;
    const userid = req.userId;
    await client.query("BEGIN");
    const ismember = await client.query(
      "SELECT * FROM team_members WHERE team_id=$1 AND user_id=$2",
      [teamid, userid],
    );
    if (ismember.rows.length == 0)
      throw new AppError("Opps! error occured", 401);
    
    await client.query(
      "DELETE FROM team_members WHERE user_id=$1 AND team_id=$2",
      [userid, teamid],
    );
    await client.query("DELETE FROM standups WHERE user_id=$1 AND team_id=$2",[userid,teamid]);

    await client.query("COMMIT");
    return res.status(200).json({ success: true, message: "Left team successfully" });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    next(error);
  } finally {
    if (client) client.release();
  }
};


export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const { teamId } = req.params;
    const { name, timeZone, open_time, close_time } = req.body;
    
    const updated = await client.query(
      "UPDATE teams SET name = $1, timezone = $2, submission_open = $3, submission_close = $4 WHERE id = $5 RETURNING *",
      [name, timeZone, open_time, close_time, teamId]
    );
console.log(updated.rows)
    return res.status(200).json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};


export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const teamData = createTeamSchema.safeParse(req.body);
    if (!teamData.success) {
      throw new AppError(teamData.error.issues[0]!.message, 400);
    }
    const { teamName, timeZone, open_time, close_time, reminder_time } =
      teamData.data;

    const userid = req.userId;
    const slug = slugify(teamName, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: /[*+~.()'"!:@]/g, // remove characters that match regex
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    const mixedvlaues = nanoid();
    const invite_link = `${slug}-${mixedvlaues}`;
    await client.query("BEGIN");
    const findTeam = await client.query(
      "SELECT * FROM teams WHERE name=$1 AND created_by=$2",
      [teamName, userid],
    );
    if (findTeam.rows.length != 0)
      throw new AppError("Team already exists", 401);
    const newTeam = await client.query(
      "INSERT INTO teams(name,slug,timezone,submission_open,submission_close,reminder_time,created_by,invite_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        teamName,
        slug,
        timeZone,
        open_time,
        close_time,
        reminder_time,
        userid,
        invite_link,
      ],
    );

    if (newTeam.rows.length == 0) throw new AppError("Failed To Create", 500);
    const jointeamasadmin = await client.query(
      "INSERT INTO team_members(team_id,user_id,role,current_streak,longest_streaK)VALUES($1,$2,$3,$4,$5) RETURNING *",
      [newTeam?.rows[0].id, userid, "admin", 0, 0],
    );
    if (jointeamasadmin.rows.length == 0)
      throw new AppError("Failed to join", 500);
    await client.query("COMMIT");
    const data = newTeam.rows[0];
    return res.json({
      message: "Team created successfully",
      team: {
        team_name: data.name,
        created_by: data.created_by,
        created_at: data.created_at,
      },
      success: true,
    });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    next(err);
  } finally {
    if (client) client.release();
  }
};

