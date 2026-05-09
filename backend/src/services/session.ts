import type { Response } from "express";

export function setSession(res:Response,token:string,nameoftoken:string){
    return res.cookie(nameoftoken, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
}