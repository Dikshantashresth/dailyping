import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import clientPool from "../utils/supabase/db";

export const getDiscussions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await clientPool.connect();
  try {
    const { teamId, blockerId } = req.params;
    if (!teamId || !blockerId) throw new AppError("Bad Request", 400);
    const data = await client.query(
      `SELECT d.*, p.name, p.avatar_url 
       FROM discussion d 
       INNER JOIN profiles p ON d.user_id = p.id 
       WHERE d.blocker_id = $1 AND d.team_id = $2 
       ORDER BY d.created_at ASC`,
      [blockerId, teamId],
    );

    return res.status(200).json({ discussions: data.rows, success: true });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const insertDiscussion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await clientPool.connect();
  try {
    const { teamId, blockerId } = req.params;
    const userId = req.userId;
    const { content } = req.body;
    if (!teamId || !blockerId || !content)
      throw new AppError("Bad Request", 400);
    const data = await client.query(
      "INSERT INTO discussion(content, team_id, user_id, blocker_id) VALUES($1, $2, $3, $4) RETURNING *",
      [content, teamId, userId, blockerId],
    );
    if (data.rows.length === 0) throw new AppError("Unexpected Error", 500);

    const discussion = data.rows[0];
    const profile = await client.query(
      "SELECT name, avatar_url FROM profiles WHERE id = $1",
      [userId],
    );

    return res.status(201).json({
      discussion: { ...discussion, ...profile.rows[0] },
      success: true,
    });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const getReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await clientPool.connect();
  try {
    const { commentid } = req.params;
    if (!commentid) throw new AppError("Bad Request", 400);
    const data = await client.query(
      `SELECT dr.*, p.name, p.avatar_url 
       FROM discussion_replies dr 
       INNER JOIN profiles p ON dr.user_id = p.id 
       WHERE dr.parent_discussion_id = $1 
       ORDER BY dr.created_at ASC`,
      [commentid],
    );
    return res.status(200).json({ replies: data.rows, success: true });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};

export const insertReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await clientPool.connect();
  try {
    const { commentid } = req.params;
    const userId = req.userId;
    const { content } = req.body;
    if (!commentid || !content) throw new AppError("Bad Request", 400);
    const data = await client.query(
      "INSERT INTO discussion_replies(content, user_id, parent_discussion_id) VALUES($1, $2, $3) RETURNING *",
      [content, userId, commentid],
    );
    if (data.rows.length === 0) throw new AppError("Unexpected Error", 500);

    const reply = data.rows[0];
    const profile = await client.query(
      "SELECT name, avatar_url FROM profiles WHERE id = $1",
      [userId],
    );

    return res.status(201).json({
      reply: { ...reply, ...profile.rows[0] },
      success: true,
    });
  } catch (error) {
    next(error);
  } finally {
    client.release();
  }
};
