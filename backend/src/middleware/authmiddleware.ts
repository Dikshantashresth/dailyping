import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import AppError from "../utils/AppError";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let access_token = req.cookies?.token;
    const refresh_token = req.cookies?.refresh_token;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      },
    );

    let {
      data: { user },
      error,
    } = await supabase.auth.getUser();

  
    if (error && refresh_token) {
      

      const { data: refreshData, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token,
        });

      if (refreshError || !refreshData.session) {
        throw new AppError("Session expired", 401);
      }

      // set new tokens
      res.cookie("token", refreshData.session.access_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      res.cookie("refresh_token", refreshData.session.refresh_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      // retry with new token
      const retryClient = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${refreshData.session.access_token}`,
            },
          },
        },
      );

      const retry = await retryClient.auth.getUser();

      user = retry.data.user;
    }

    if (!user) throw new AppError("Unauthorized", 401);

    req.userId = user.id;
    
    next();
  } catch (err) {
    next(new AppError("Invalid or expired session", 401));
  }
}
