"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useState(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.success) {
          router.push("/dashboard");
        }
      } catch (err) {
        // Not logged in, stay on login page
      }
    };
    checkAuth();
  });


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        toast.success("Welcome back!");
        dispatch(setUser({ id: "temp-id", email }));
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to login");
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
          <h1 className="text-xl font-semibold tracking-tight">Sign in to Daily Ping</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Welcome back
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-foreground font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
