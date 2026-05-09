import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Standup {
  id: string;
  user_id: string;
  team_id: string;
  did: string;
  will_do: string;
  blockers?: string;
  has_blockers?: boolean;
  for_date: string;
  created_at:string;
  user_name?: string;
  avatar_url?: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  }
}

interface StandupsState {
  today: Standup[];
  missing: any[]; // Missing users array
}

const initialState: StandupsState = {
  today: [],
  missing: [],
};

export const standupsSlice = createSlice({
  name: 'standups',
  initialState,
  reducers: {
    setTodayStandups: (state, action: PayloadAction<Standup[]>) => {
      state.today = action.payload;
    },
    setMissingStandups: (state, action: PayloadAction<any[]>) => {
      state.missing = action.payload;
    },
  },
});

export const { setTodayStandups, setMissingStandups } = standupsSlice.actions;
export default standupsSlice.reducer;
