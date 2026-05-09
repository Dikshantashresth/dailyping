"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoined: () => void;
}

export default function JoinTeamModal({ isOpen, onClose, onJoined }: JoinTeamModalProps) {
  const [inviteLink, setInviteLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // The backend joinTeam expects the invite_id in the URL
      const res = await api.post(`/teams/${inviteLink}/join`);
      if (res.data.success) {
        toast.success("Joined team!");
        setInviteLink("");
        onJoined();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Join a team</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Invite link</label>
            <input
              type="text"
              required
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm font-mono"
              placeholder="Paste invite link here"
            />
            <p className="text-xs text-muted-foreground">Ask your team admin for the invite link.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Joining..." : "Join team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
