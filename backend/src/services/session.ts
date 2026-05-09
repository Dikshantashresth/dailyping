import type { Response } from "express";

export function setSession(res:Response,token:string,nameoftoken:string){
    return res.cookie(nameoftoken, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
}