import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
}
const initialState: AuthState = { user: null, isAuthenticated: false };
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.user = 'alumno';
      state.isAuthenticated = true;
    },
    logout() {
      return initialState;
    },
  },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
