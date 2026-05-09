import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import teamReducer from './features/teamSlice';
import standupsReducer from './features/standupsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    team: teamReducer,
    standups: standupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
