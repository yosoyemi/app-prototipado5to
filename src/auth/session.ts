import 'react-native-get-random-values';
import { Session } from '../types/session';

export function createSession(): Session {
  const bytes = new Uint8Array(32);
  const randomSource = globalThis as typeof globalThis & {
    crypto: { getRandomValues: (array: Uint8Array) => Uint8Array };
  };
  randomSource.crypto.getRandomValues(bytes);
  const token = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  return { user: 'alumno', token };
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const session = value as Partial<Session>;
  return (
    session.user === 'alumno' &&
    typeof session.token === 'string' &&
    /^[a-f0-9]{64}$/.test(session.token)
  );
}
