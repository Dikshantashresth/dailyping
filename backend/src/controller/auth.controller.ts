import type { NextFunction, Request, Response } from "express";
import supabase from "../utils/supabase/client.js";
import AppError from "../utils/AppError";
import clientPool from "../utils/supabase/db";
import { setSession } from "../services/session";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createClient } from "@supabase/supabase-js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userdata = loginSchema.safeParse(req.body);
    const email = userdata.data?.email!;
    const password = userdata.data?.password!;
    if (!userdata.success) {
      throw new AppError(userdata.error.issues[0]!.message, 400);
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return next(new AppError(error.message, 400));
    const user = await client.query("SELECT * FROM profiles WHERE email = $1", [
      email,
    ]);
    if (user.rows.length == 0)
      return next(new AppError("User doesn't exist in profiles", 404));

    if (!data.session || !data.user)
      throw new AppError("Login Unsuccessful", 401);

    if (data.session) {
      setSession(res, data.session.access_token, "token");
      setSession(res, data.session.refresh_token, "refresh_token");
    }
    return res
      .status(200)
      .json({ messsage: "Login Successful", success: true });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userdata = registerSchema.safeParse(req.body);

    if (!userdata.success) {
      throw new AppError(userdata.error.issues[0]!.message, 400);
    }

    const { username, email, password } = userdata.data;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
        },
      },
    });
    if (error) return next(new AppError(error.message, 400));

    if (data.session) {
      setSession(res, data.session.access_token, "token");
      setSession(res, data.session.refresh_token, "refresh_token");
      return res.status(200).json({
        message: "Registration Completed",
        success: true,
        verified: true,
      });
    }

    return res.status(200).json({
      message: "Please verify your email to continue",
      success: true,
      verified: false,
    });
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    next(err);
  } finally {
    if (client) client.release();
  }
};


export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    // Optional but recommended: invalidate session in Supabase
    if (token) {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        },
      );

      await supabase.auth.signOut();
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("token");
    res.clearCookie("refresh_token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
    throw new AppError("Something went wrong", 500);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let client;
  try {
    client = await clientPool.connect();
    const userId = req.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const result = await client.query(
      "SELECT id, name, email, avatar_url FROM profiles WHERE id = $1",
      [userId],
    );
    if (result.rows.length === 0) throw new AppError("User not found", 404);

    return res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (client) client.release();
  }
};

