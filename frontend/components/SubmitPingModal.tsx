"use client";

import { useState } from "react";
import { X, Flame, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface SubmitPingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  teamId: string;
}

export default function SubmitPingModal({ isOpen, onClose, onSubmitted, teamId }: SubmitPingModalProps) {
  const [did, setDid] = useState("");
  const [willDo, setWillDo] = useState("");
  const [hasBlocker, setHasBlocker] = useState(false);
  const [blockers, setBlockers] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

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
      await api.post(`/standups/${teamId}`, payload);
      toast.success("Ping submitted! 🏓");
      setDid("");
      setWillDo("");
      setHasBlocker(false);
      setBlockers("");
      onSubmitted();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-background rounded-3xl border border-border shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Submit your Ping</h2>
              <p className="text-xs text-muted-foreground font-medium">Quick daily update</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">What did you do?</label>
            <textarea
              required
              value={did}
              onChange={(e) => setDid(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm resize-none"
              placeholder="- Finished the login page UI&#10;- Wrote unit tests"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">What will you do today?</label>
            <textarea
              required
              value={willDo}
              onChange={(e) => setWillDo(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-color-blue/20 focus:border-color-blue transition-all font-mono text-sm resize-none"
              placeholder="- Integrate backend APIs&#10;- PR Review"
            />
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${hasBlocker ? "bg-rose-50 border-rose-100" : "bg-muted/20 border-border"}`}>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasBlocker}
                onChange={(e) => setHasBlocker(e.target.checked)}
                className="w-5 h-5 rounded-lg border-border accent-rose-500"
              />
              <span className={`text-sm font-bold ${hasBlocker ? "text-rose-700" : "text-muted-foreground"}`}>
                I have a blocker
              </span>
            </label>

            {hasBlocker && (
              <textarea
                required={hasBlocker}
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                className="w-full h-20 px-4 py-3 mt-3 bg-card border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all font-mono text-sm resize-none"
                placeholder="Describe what's holding you back..."
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-foreground text-background py-3 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-gray-200 transition-all disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Ping"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
