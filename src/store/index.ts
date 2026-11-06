import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login } from './authSlice';
import tasksReducer, { setTasks } from './tasksSlice';
import { loadLocalData, saveLocalData } from '../storage/localStorage';

export const store = configureStore({
  reducer: { auth: authReducer, tasks: tasksReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
let initialization: Promise<void> | undefined;
let writeQueue = Promise.resolve();
export function initializeStore(onStorageError: () => void): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      const saved = await loadLocalData();
      store.dispatch(setTasks(saved.tasks));
      if (saved.user === 'alumno') {
        store.dispatch(login());
      }
      let previous = store.getState();
      store.subscribe(() => {
        const current = store.getState();
        if (current === previous) {
          return;
        }
        previous = current;
        writeQueue = writeQueue
          .then(() => saveLocalData(current.auth, current.tasks))
          .catch(onStorageError);
      });
    })().catch(error => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
}
