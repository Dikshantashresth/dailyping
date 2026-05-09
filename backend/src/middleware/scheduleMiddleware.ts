import type { NextFunction, Request, Response } from "express";
import clientPool from "../utils/supabase/db";
import AppError from "../utils/AppError";

export const checkSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await clientPool.connect();
  try {
    const teamId = req.params.teamId;

    const now = new Date();
    const teamInfo = await client.query(
      "SELECT * FROM teams WHERE id=$1",
      [teamId],
    );
    
    if (teamInfo.rows.length == 0) throw new AppError("No information", 404);
    const teamData = teamInfo.rows[0];
    const timelocale = new Date(
      now.toLocaleString("en-us", { timeZone: teamData.timeZone }),
    );
    const currentHour = timelocale.getHours();
    const currentMinutes = timelocale.getMinutes();
    const [openHour, openMinute] = teamData.submission_open
      .split(":")
      .map(Number);
    const [closeHour, closeMinute] = teamData.submission_close
      .split(":")
      .map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;

    const currentTime = currentHour * 60 + currentMinutes;
    if (currentTime>=openTime && currentTime<=closeTime) {
      next();
      return res
        .status(200)
        .json({ message: "Submission window is open", success: true });
    } else {
      return next(
        new AppError(
          "Window is closed",
          401,
        ),
      );
    }
  } catch (error) {
    next(error)
  } finally {
    client.release();
  }
};
