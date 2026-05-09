"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  History,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { type Standup } from "@/lib/features/standupsSlice";

export default function TeamHistoryPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const [standups, setStandups] = useState<Standup[]>([]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/standups/history/${teamId}/${date}`);
      if (res.data.success) {
        setStandups(res.data.standups);
      }
    } catch (err) {
      setStandups([]);
    } finally {
      setIsLoading(false);
    }
  }, [teamId, date]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Team History
          </h1>
          <p className="text-muted-foreground text-base mt-2 font-medium">
            Browse past standups and progress.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-background p-2 rounded-2xl border border-border shadow-sm">
          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              setDate(format(d, "yyyy-MM-dd"));
            }}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-border/50">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground outline-none"
            />
          </div>

          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() + 1);
              setDate(format(d, "yyyy-MM-dd"));
            }}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-muted/40 animate-pulse rounded-3xl border border-border/50"
            />
          ))
        ) : standups.length === 0 ? (
          <div className="text-center py-20 bg-backgorund rounded-3xl border border-dashed border-border shadow-sm">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No history found
            </h3>
            <p className="text-muted-foreground font-medium">
              No standups were recorded for this date.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {standups.map((standup) => (
              <HistoryCard key={standup.id} standup={standup} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ standup }: { standup: Standup }) {
  const name = standup.user_name || "Unknown";
  let did = standup.did;
  let willDo = "";
  try {
    const obj = JSON.parse(standup.did);
    if (obj.did) {
      did = obj.did;
      willDo = obj.will_do || "";
    }
  } catch {}

  return (
    <div className="bg-white border border-border rounded-3xl p-6 hover:shadow-lg hover:shadow-gray-800/50 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground font-medium">
            {format(new Date(standup.for_date), "h:mm a")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            What was done
          </p>
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
            <p className="text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed">
              {did}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Planned for next
          </p>
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
            <p className="text-sm font-mono whitespace-pre-wrap text-foreground leading-relaxed">
              {willDo || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
