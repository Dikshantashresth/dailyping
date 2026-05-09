"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function SubmitStandupPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const router = useRouter();

  const [did, setDid] = useState("");
  const [willDo, setWillDo] = useState("");
  const [hasBlocker, setHasBlocker] = useState(false);
  const [blockers, setBlockers] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        team_id: teamId,
        did: JSON.stringify({ did, will_do: willDo }),
        blockers: hasBlocker ? blockers : null,
        has_blocker: hasBlocker,
        for_date: new Date().toISOString().split("T")[0],
      };
      await api.post("/standups", payload);
      toast.success("Ping submitted! 🏓");
      router.push(`/dashboard/team/${teamId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Submit your Ping</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Answer 3 quick questions. Keep it concise.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            What did you do?
          </label>
          <textarea
            required
            value={did}
            onChange={(e) => setDid(e.target.value)}
            className="w-full h-28 px-3.5 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono text-sm resize-none"
            placeholder="- Finished the login page UI&#10;- Wrote unit tests for auth middleware"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            What will you do today?
          </label>
          <textarea
            required
            value={willDo}
            onChange={(e) => setWillDo(e.target.value)}
            className="w-full h-28 px-3.5 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-mono text-sm resize-none"
            placeholder="- Integrate backend APIs&#10;- Review PR #42"
          />
        </div>

        <div className="bg-muted rounded-xl p-4 border border-border">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasBlocker}
              onChange={(e) => setHasBlocker(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-red-500"
            />
            <span className="text-sm font-medium">I have a blocker</span>
          </label>

          {hasBlocker && (
            <textarea
              required={hasBlocker}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              className="w-full h-20 px-3.5 py-3 mt-3 bg-red-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition-all font-mono text-sm resize-none"
              placeholder="Waiting on design assets for the dashboard."
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-foreground text-background px-6 py-2 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Ping"}
          </button>
        </div>
      </form>
    </div>
  );
}
