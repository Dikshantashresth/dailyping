"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTeamModal({ isOpen, onClose, onCreated }: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("17:00");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        teamName,
        timeZone,
        open_time: openTime,
        close_time: closeTime,
        reminder_time: 60,
      };
      const res = await api.post("/teams", payload);
      if (res.data.success) {
        toast.success("Team created!");
        setTeamName("");
        onCreated();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Create a new team</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Team name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              placeholder="e.g. Engineering"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Timezone</label>
            <input
              type="text"
              required
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              placeholder="e.g. Asia/Kathmandu"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Opens at</label>
              <input
                type="time"
                required
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Closes at</label>
              <input
                type="time"
                required
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              />
            </div>
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
              {isLoading ? "Creating..." : "Create team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
