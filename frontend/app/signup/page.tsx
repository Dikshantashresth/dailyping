"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/sign-up", { username, email, password });
      if (res.data.success) {
        toast.success("Account created! Please check your email.");
        router.push("/verify-email");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-9 h-9 bg-foreground rounded-md flex items-center justify-center text-background font-mono font-bold text-xs mb-5">
            DP
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Start doing async standups today
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-2 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
