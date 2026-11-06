import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '../store/authSlice';
import { Task } from '../types/task';
import { Session } from '../types/session';
import { createSession, isSession } from '../auth/session';

const SESSION_KEY = '@actividades/session';
const TASKS_KEY = '@actividades/tasks';
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const task = value as Partial<Task>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean'
  );
}
export async function loadLocalData(): Promise<{
  session: Session | null;
  tasks: Task[];
}> {
  const [sessionText, tasksText] = await Promise.all([
    AsyncStorage.getItem(SESSION_KEY),
    AsyncStorage.getItem(TASKS_KEY),
  ]);
  let storedSession: unknown = null;
  try {
    storedSession = sessionText ? JSON.parse(sessionText) : null;
  } catch {
    storedSession = null;
  }
  const tasks: unknown = tasksText ? JSON.parse(tasksText) : [];
  if (
    !Array.isArray(tasks) ||
    !tasks.every(isTask) ||
    new Set(tasks.map(task => task.id)).size !== tasks.length
  ) {
    throw new Error('Tareas locales no válidas.');
  }
  const session =
    storedSession === 'alumno'
      ? createSession()
      : isSession(storedSession)
      ? storedSession
      : null;
  if (storedSession === 'alumno' && session) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else if (!session && sessionText !== null) {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
  return { session, tasks };
}
export async function saveLocalData(
  auth: AuthState,
  tasks: Task[],
): Promise<void> {
  if (auth.isAuthenticated && auth.user === 'alumno' && auth.token) {
    await AsyncStorage.multiSet([
      [SESSION_KEY, JSON.stringify({ user: auth.user, token: auth.token })],
      [TASKS_KEY, JSON.stringify(tasks)],
    ]);
  } else {
    await AsyncStorage.removeItem(SESSION_KEY);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}
