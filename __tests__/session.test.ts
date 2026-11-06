import authReducer, {
  login,
  logout,
  restoreSession,
} from '../src/store/authSlice';
import { createSession, isSession } from '../src/auth/session';

test('genera tokens distintos con 32 bytes y valida la sesión local', () => {
  const first = createSession();
  const second = createSession();
  expect(first.token).toMatch(/^[a-f0-9]{64}$/);
  expect(second.token).not.toBe(first.token);
  expect(isSession(first)).toBe(true);
  expect(isSession({ ...first, token: '' })).toBe(false);
  expect(isSession({ ...first, user: 'otro' })).toBe(false);
});

test('restaura el mismo token y lo borra al cerrar sesión', () => {
  const authenticated = authReducer(undefined, login());
  const session = { user: 'alumno' as const, token: authenticated.token! };
  expect(authReducer(undefined, restoreSession(session))).toEqual(
    authenticated,
  );
  const loggedOut = authReducer(authenticated, logout());
  expect(loggedOut).toEqual({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  expect(authReducer(loggedOut, login()).token).not.toBe(session.token);
});
