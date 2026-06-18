"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Reply, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  setDiscussions,
  addDiscussion,
  setReplies,
  addReply,
  type Discussion,
  type DiscussionReply,
} from "@/lib/features/discussionsSlice";

interface BlockerCardProps {
  blocker: {
    id: string;
    team_id: string;
    keyword: string;
    content?: string;
    occurrence_count: number;
    first_seen: string;
    last_seen: string;
    resolved: boolean;
    resolved_at?: string;
    name?: string;
    avatar_url?: string;
    tags?: string[];
  };
  isAdmin: boolean;
  onResolve: (id: string) => void;
}

function DiscussionThread({
  discussion,
  teamId,
  replies,
  expandedReplies,
  onToggleReplies,
  replyingTo,
  onSetReplyingTo,
  replyContent,
  onReplyContentChange,
  onPostReply,
}: {
  discussion: Discussion;
  teamId: string;
  replies: DiscussionReply[];
  expandedReplies: boolean;
  onToggleReplies: () => void;
  replyingTo: boolean;
  onSetReplyingTo: () => void;
  replyContent: string;
  onReplyContentChange: (val: string) => void;
  onPostReply: () => void;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Discussion Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden shrink-0">
            {discussion.avatar_url ? (
              <img src={discussion.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              (discussion.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-foreground">{discussion.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Discussion Content */}
      <div className="px-4 py-3">
        <p className="text-[13px] text-foreground/80 leading-relaxed">{discussion.content}</p>
      </div>

      {/* Reactions + Reply Bar */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mock reaction avatars */}
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[8px] font-bold text-primary">A</div>
            <div className="w-5 h-5 rounded-full bg-green-500/20 border-2 border-card flex items-center justify-center text-[8px] font-bold text-green-600">B</div>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">+2</span>
          <button className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-[10px] hover:bg-muted transition-colors">
            😊
          </button>
        </div>
        <button
          onClick={onSetReplyingTo}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Reply className="w-3.5 h-3.5" />
          Reply
        </button>
      </div>

      {/* Replies */}
      {expandedReplies && replies.length > 0 && (
        <div className="border-t border-border bg-muted/20">
          {replies.map((r) => (
            <div key={r.id} className="px-4 py-3 border-b border-border/50 last:border-b-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground overflow-hidden">
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (r.name || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <p className="text-[11px] font-semibold text-foreground">{r.name}</p>
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed pl-8">{r.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {replyingTo && (
        <div className="border-t border-border p-3 bg-muted/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 h-8 text-[12px] px-3 bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              onKeyDown={(e) => e.key === "Enter" && onPostReply()}
            />
            <button
              onClick={onPostReply}
              disabled={!replyContent.trim()}
              className="px-3 h-8 bg-foreground text-background rounded-md text-[12px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlockerCard({ blocker, isAdmin, onResolve }: BlockerCardProps) {
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const dispatch = useAppDispatch();
  const discussions = useAppSelector((s) => s.discussions.byBlockerId[blocker.id] || []);
  const replies = useAppSelector((s) => s.discussions.repliesByDiscussionId);
  const isLoading = useAppSelector((s) => s.discussions.loadingByBlockerId[blocker.id]);

  const fetchDiscussions = useCallback(async () => {
    if (!showDiscussion) return;
    dispatch({ type: "discussions/setLoading", payload: { blockerId: blocker.id, loading: true } });
    try {
      const res = await api.get(`/discussions/${blocker.team_id}/blockers/${blocker.id}/discussions`);
      if (res.data.success) {
        dispatch(setDiscussions({ blockerId: blocker.id, discussions: res.data.discussions }));
      }
    } catch {
      dispatch(setDiscussions({ blockerId: blocker.id, discussions: [] }));
    }
  }, [showDiscussion, blocker.id, blocker.team_id, dispatch]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const handlePostDiscussion = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/discussions/${blocker.team_id}/blockers/${blocker.id}/discussions`, {
        content: newComment,
      });
      if (res.data.success) {
        dispatch(addDiscussion({ blockerId: blocker.id, discussion: res.data.discussion }));
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to post discussion", err);
    }
  };

  const handlePostReply = async (discussionId: string) => {
    if (!replyContent.trim()) return;
    try {
      const res = await api.post(`/discussions/${blocker.team_id}/discussions/${discussionId}/replies`, {
        content: replyContent,
      });
      if (res.data.success) {
        dispatch(addReply({ discussionId, reply: res.data.reply }));
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (err) {
      console.error("Failed to post reply", err);
    }
  };

  const fetchReplies = useCallback(async (discussionId: string) => {
    try {
      const res = await api.get(`/discussions/${blocker.team_id}/discussions/${discussionId}/replies`);
      if (res.data.success) {
        dispatch(setReplies({ discussionId, replies: res.data.replies }));
      }
    } catch {
      dispatch(setReplies({ discussionId, replies: [] }));
    }
  }, [blocker.team_id, dispatch]);

  const toggleReplies = (discussionId: string) => {
    const isExpanded = expandedReplies[discussionId];
    setExpandedReplies((prev) => ({ ...prev, [discussionId]: !isExpanded }));
    if (!isExpanded && (!replies[discussionId] || replies[discussionId].length === 0)) {
      fetchReplies(discussionId);
    }
  };

  const timeAgo = blocker.last_seen
    ? formatDistanceToNow(new Date(blocker.last_seen), { addSuffix: true })
    : "";

  if (blocker.resolved) {
    return (
      <div className="bg-card border border-border/50 rounded-lg p-4 opacity-60 hover:opacity-80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-foreground">{blocker.keyword}</p>
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Resolved {blocker.resolved_at ? formatDistanceToNow(new Date(blocker.resolved_at), { addSuffix: true }) : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-xs hover:shadow-md transition-all flex flex-col">
      {/* Card Content */}
      <div className="p-4">
        {/* User Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden shrink-0">
            {blocker.avatar_url ? (
              <img src={blocker.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              (blocker.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">{blocker.name || "Unknown"}</p>
            <p className="text-[10px] text-muted-foreground">{timeAgo}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{blocker.keyword}</h3>

        {/* Description */}
        {blocker.content && (
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
            &ldquo;{blocker.content}&rdquo;
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {blocker.occurrence_count > 2 && (
            <span className="text-[10px] bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md font-semibold">
              High Priority
            </span>
          )}
          {blocker.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-semibold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {(!blocker.tags || blocker.tags.length === 0) && (
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-semibold text-muted-foreground">
              Blocker
            </span>
          )}
        </div>
      </div>

      {/* Discuss Button */}
      <div className="px-4 pb-4 pt-4  flex items-center justify-end border-t border-border">
        <button
          onClick={() => setShowDiscussion(!showDiscussion)}
          className="flex max-w-full px-2 items-center justify-center gap-2 h-9 rounded-lg bg-foreground text-background font-semibold text-[13px] hover:opacity-90 transition-opacity"
        >
          <MessageSquare className="w-4 h-4" />
          Discuss
          {discussions.length > 0 && (
            <span className="text-xs opacity-60">({discussions.length})</span>
          )}
        </button>
      </div>

      {/* Discussion Panel */}
      {showDiscussion && (
        <div className="border-t border-border bg-muted/20 p-4 space-y-3">
          {/* Existing Discussions */}
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground animate-pulse">Loading discussions...</p>
            </div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">No discussions yet. Start the conversation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((d) => (
                <DiscussionThread
                  key={d.id}
                  discussion={d}
                  teamId={blocker.team_id}
                  replies={replies[d.id] || []}
                  expandedReplies={!!expandedReplies[d.id]}
                  onToggleReplies={() => toggleReplies(d.id)}
                  replyingTo={replyingTo === d.id}
                  onSetReplyingTo={() => setReplyingTo(replyingTo === d.id ? null : d.id)}
                  replyContent={replyingTo === d.id ? replyContent : ""}
                  onReplyContentChange={setReplyContent}
                  onPostReply={() => handlePostReply(d.id)}
                />
              ))}
            </div>
          )}

          {/* New Discussion Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Start a discussion..."
              className="flex-1 h-9 text-[13px] px-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              onKeyDown={(e) => e.key === "Enter" && handlePostDiscussion()}
            />
            <button
              onClick={handlePostDiscussion}
              disabled={!newComment.trim()}
              className="px-4 h-9 bg-foreground text-background rounded-lg text-[13px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
