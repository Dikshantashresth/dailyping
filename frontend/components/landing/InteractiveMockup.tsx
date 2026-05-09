"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react";

const DUMMY_UPDATES = [
  {
    id: 1,
    user: "Alex Rivera",
    avatar: "AR",
    color: "bg-blue-500",
    time: "9:05 AM",
    did: "Completed the dark mode implementation for the dashboard.",
    next: "Starting on the Stripe integration for Pro plans.",
    blocker: null,
  },
  {
    id: 2,
    user: "Sarah Chen",
    avatar: "SC",
    color: "bg-purple-500",
    time: "9:12 AM",
    did: "Refactored the team creation flow and optimized API routes.",
    next: "Working on the mobile responsive navigation bar.",
    blocker: "Waiting for the new brand assets from the design team.",
  },
  {
    id: 3,
    user: "Jordan Smith",
    avatar: "JS",
    color: "bg-emerald-500",
    time: "9:24 AM",
    did: "Fixed several bugs in the blocker detection algorithm.",
    next: "Implementing the streak system logic in the backend.",
    blocker: null,
  },
];

export default function InteractiveMockup() {
  const [activeTab, setActiveTab] = useState("Feed");
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => (prev < DUMMY_UPDATES.length ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-card">
      {/* Browser Top Bar */}
      <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
        </div>
        <div className="flex-1 max-w-md bg-background/50 border border-border h-7 rounded-md flex items-center px-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-muted-foreground font-mono truncate">
            dailyping.app/dashboard/engineering
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mock Sidebar */}
        <div className="w-48 border-r border-border p-4 flex flex-col gap-6 hidden sm:flex">
          <div className="space-y-1">
            <div className="h-2 w-12 bg-muted rounded mb-4" />
            {["Feed", "History", "Blockers", "Members", "Settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-border">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-primary" />
                </div>
                <div className="h-2 w-16 bg-muted rounded" />
             </div>
             <div className="space-y-2">
                <div className="h-1.5 w-full bg-muted rounded opacity-50" />
                <div className="h-1.5 w-3/4 bg-muted rounded opacity-30" />
             </div>
          </div>
        </div>

        {/* Mock Content */}
        <div className="flex-1 flex flex-col bg-background/30 overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground">Engineering Team</h3>
                <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                   <Clock className="w-3 h-3" /> Daily window: 9:00 AM - 10:00 AM
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-bold`}>
                            {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                 </div>
                 <div className="w-7 h-7 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                    <span className="text-[8px]">+5</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              {DUMMY_UPDATES.slice(0, visibleItems).map((update, idx) => (
                <div 
                  key={update.id} 
                  className="bg-card border border-border p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full ${update.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {update.avatar}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground leading-none">{update.user}</h4>
                      <span className="text-[9px] text-muted-foreground">{update.time}</span>
                    </div>
                    <div className="ml-auto bg-muted/50 px-2 py-0.5 rounded-full text-[8px] font-bold text-muted-foreground flex items-center gap-1">
                       <CheckCircle2 className="w-2 h-2 text-emerald-500" /> Pinged
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Yesterday</span>
                      <p className="text-[10px] text-foreground font-medium">{update.did}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest block mb-1">Today</span>
                      <p className="text-[10px] text-foreground font-medium">{update.next}</p>
                    </div>
                    {update.blocker && (
                      <div className="bg-rose-500/5 border border-rose-500/20 p-2 rounded-lg flex gap-2">
                        <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                        <div>
                           <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest block mb-0.5">Blocker</span>
                           <p className="text-[10px] text-rose-700 dark:text-rose-300 font-semibold leading-tight">{update.blocker}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {visibleItems < DUMMY_UPDATES.length && (
                <div className="h-24 border border-dashed border-border rounded-2xl flex items-center justify-center">
                   <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px] font-mono">Someone is typing...</span>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Panel */}
        <div className="w-64 border-l border-border p-6 bg-muted/10 hidden lg:flex flex-col gap-6">
           <div className="space-y-4">
              <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Team Health</div>
              <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
                 <div className="text-2xl font-black text-foreground mb-1">94%</div>
                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[94%]" />
                 </div>
                 <p className="text-[9px] text-muted-foreground mt-2 font-medium">Alignment score this week</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Blockers</div>
              <div className="space-y-2">
                 <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    <p className="text-[10px] font-bold text-rose-700 dark:text-rose-400">Design assets missing</p>
                    <p className="text-[8px] text-rose-600/70 mt-1">Reported by Sarah</p>
                 </div>
              </div>
           </div>
           
           <div className="mt-auto bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                 <Zap className="w-3 h-3 text-primary" />
                 <span className="text-[10px] font-black text-primary uppercase">Pro Tip</span>
              </div>
              <p className="text-[9px] text-foreground font-medium leading-relaxed">
                 Use @mentions to directly address blockers to specific team members.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
