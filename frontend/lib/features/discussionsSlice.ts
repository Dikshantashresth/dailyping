import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Discussion {
  id: string;
  content: string;
  team_id: string;
  user_id: string;
  blocker_id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface DiscussionReply {
  id: string;
  content: string;
  user_id: string;
  parent_discussion_id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

interface DiscussionsState {
  byBlockerId: Record<string, Discussion[]>;
  repliesByDiscussionId: Record<string, DiscussionReply[]>;
  loadingByBlockerId: Record<string, boolean>;
}

const initialState: DiscussionsState = {
  byBlockerId: {},
  repliesByDiscussionId: {},
  loadingByBlockerId: {},
};

export const discussionsSlice = createSlice({
  name: 'discussions',
  initialState,
  reducers: {
    setDiscussions: (state, action: PayloadAction<{ blockerId: string; discussions: Discussion[] }>) => {
      state.byBlockerId[action.payload.blockerId] = action.payload.discussions;
      state.loadingByBlockerId[action.payload.blockerId] = false;
    },
    setLoading: (state, action: PayloadAction<{ blockerId: string; loading: boolean }>) => {
      state.loadingByBlockerId[action.payload.blockerId] = action.payload.loading;
    },
    addDiscussion: (state, action: PayloadAction<{ blockerId: string; discussion: Discussion }>) => {
      const existing = state.byBlockerId[action.payload.blockerId] || [];
      state.byBlockerId[action.payload.blockerId] = [...existing, action.payload.discussion];
    },
    setReplies: (state, action: PayloadAction<{ discussionId: string; replies: DiscussionReply[] }>) => {
      state.repliesByDiscussionId[action.payload.discussionId] = action.payload.replies;
    },
    addReply: (state, action: PayloadAction<{ discussionId: string; reply: DiscussionReply }>) => {
      const existing = state.repliesByDiscussionId[action.payload.discussionId] || [];
      state.repliesByDiscussionId[action.payload.discussionId] = [...existing, action.payload.reply];
    },
  },
});

export const { setDiscussions, setLoading, addDiscussion, setReplies, addReply } = discussionsSlice.actions;
export default discussionsSlice.reducer;
