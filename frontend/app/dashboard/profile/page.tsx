"use client";

import { useAppSelector } from "@/lib/hooks";
import { User, Mail, Shield, Calendar, History, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { type Standup } from "@/lib/features/standupsSlice";

export default function ProfilePage() {
  const user = useAppSelector((s) => s.user);
  const [history, setHistory] = useState<Standup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserHistory = useCallback(async () => {
    if (!user.id) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/standups/user/${user.id}`);
      if (res.data.success) {
        setHistory(res.data.standups || []);
      }
    } catch (err) {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUserHistory();
  }, [fetchUserHistory]);

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Your Profile
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2">
          Manage your personal information and settings.
        </p>
      </div>

      <div className="space-y-10">
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Profile Header Background */}
          <div className="h-24 bg-primary/10 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-16 h-16 rounded-xl bg-white shadow-md border-4 border-white flex items-center justify-center text-2xl font-bold text-primary">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-10 px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5 block px-1">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {user.name || "Not set"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5 block px-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <Mail className="w-5 h-5 text-color-blue" />
                    <span className="font-medium text-foreground">
                      {user.email || "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5 block px-1">
                    Account Status
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <Shield className="w-5 h-5 text-color-green" />
                    <span className="font-medium text-foreground">
                      Verified Member
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5 block px-1">
                    Member Since
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <Calendar className="w-5 h-5 text-color-amber" />
                    <span className="font-medium text-foreground">
                      {format(new Date(), "MMMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-border/60">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button className="h-8 px-4 bg-foreground text-background rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity">
                  Edit Profile
                </button>
                <button className="h-8 px-4 bg-white border border-border rounded-lg text-[13px] font-medium hover:bg-muted/50 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-color-purple/10 rounded-xl flex items-center justify-center text-color-purple">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted/40 animate-pulse rounded-xl border border-border/50"
                />
              ))
            ) : history.length === 0 ? (
              <div className="py-12 bg-white rounded-xl border border-dashed border-border text-center shadow-sm">
                <p className="text-muted-foreground font-medium">
                  No activity recorded yet.
                </p>
              </div>
            ) : (
              history.map((item) => {
                let did = item.did;
                try {
                  const obj = JSON.parse(item.did);
                  if (obj.did) did = obj.did;
                } catch {}

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                          {format(new Date(item.for_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <p className="text-sm font-mono line-clamp-2 text-foreground">
                        {did}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
