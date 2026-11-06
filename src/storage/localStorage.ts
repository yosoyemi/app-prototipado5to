import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '../store/authSlice';
import { Task } from '../types/task';

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
  user: string | null;
  tasks: Task[];
}> {
  const [sessionText, tasksText] = await Promise.all([
    AsyncStorage.getItem(SESSION_KEY),
    AsyncStorage.getItem(TASKS_KEY),
  ]);
  const session: unknown = sessionText ? JSON.parse(sessionText) : null;
  const tasks: unknown = tasksText ? JSON.parse(tasksText) : [];
  if (session !== null && session !== 'alumno') {
    throw new Error('Sesión local no válida.');
  }
  if (
    !Array.isArray(tasks) ||
    !tasks.every(isTask) ||
    new Set(tasks.map(task => task.id)).size !== tasks.length
  ) {
    throw new Error('Tareas locales no válidas.');
  }
  return { user: session, tasks };
}
export async function saveLocalData(
  auth: AuthState,
  tasks: Task[],
): Promise<void> {
  await AsyncStorage.multiSet([
    [SESSION_KEY, JSON.stringify(auth.isAuthenticated ? auth.user : null)],
    [TASKS_KEY, JSON.stringify(tasks)],
  ]);
}
