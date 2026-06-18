"use client";

import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm">
            <Mail className="w-7 h-7 animate-bounce" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-muted-foreground text-[13px] mt-3 font-medium">
            We've sent a verification link to your email address. Please click
            the link to activate your account.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm mb-8">
          <p className="text-[13px] text-muted-foreground mb-6">
            Didn't receive the email? Check your spam folder or try resending
            the link.
          </p>
          <button className="w-full bg-foreground text-background h-9 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity mb-4">
            Resend Verification Link
          </button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground">
          If you've already verified your email, you can{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            login here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
