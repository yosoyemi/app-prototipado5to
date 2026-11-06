import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSession } from '../auth/session';
import { Session } from '../types/session';

export interface AuthState {
  user: string | null;
  token: string | null;
  isAuthenticated: boolean;
}
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: {
      prepare() {
        return { payload: createSession() };
      },
      reducer(state, action: PayloadAction<Session>) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      },
    },
    restoreSession(state, action: PayloadAction<Session>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout() {
      return initialState;
    },
  },
});
export const { login, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
