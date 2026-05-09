import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Team {
  id: string;
  name: string;
  slug?: string;
  invite_id?: string;
  timezone?: string;
  submission_open?: string;
  submission_close?: string;
  role: 'admin' | 'member';
  current_streak?: number;
  longest_streak?: number;
  members_count?: number;
}

interface TeamState {
  current: Team | null;
  teams: Team[];
}

const initialState: TeamState = {
  current: null,
  teams: [],
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentTeam: (state, action: PayloadAction<Team>) => {
      state.current = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    clearTeam: (state) => {
      state.current = null;
    },
    clearAll: (state) => {
      state.current = null;
      state.teams = [];
    },
  },
});

export const { setCurrentTeam, setTeams, addTeam, clearTeam, clearAll } = teamSlice.actions;
export default teamSlice.reducer;
