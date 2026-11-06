import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTask, toggleTask } from '../src/store/tasksSlice';
import { login, logout } from '../src/store/authSlice';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

test('recupera sesión y tareas sin sobrescribir la carga inicial', async () => {
  const storage = require('@react-native-async-storage/async-storage')
    .default as jest.Mocked<typeof AsyncStorage>;
  const { loadLocalData, saveLocalData } =
    require('../src/storage/localStorage') as typeof import('../src/storage/localStorage');
  const tasks = [
    {
      id: 'saved',
      title: 'Guardada',
      description: 'Persistida',
      completed: true,
    },
  ];
  await saveLocalData({ user: 'alumno', isAuthenticated: true }, tasks);
  jest.clearAllMocks();
  const { store, initializeStore } =
    require('../src/store') as typeof import('../src/store');
  await initializeStore(jest.fn());
  expect(store.getState()).toEqual({
    auth: { user: 'alumno', isAuthenticated: true },
    tasks,
  });
  expect(storage.multiSet).not.toHaveBeenCalled();
  store.dispatch(logout());
  store.dispatch(login());
  store.dispatch(addTask('Nueva', 'Descripción'));
  store.dispatch(toggleTask('saved'));
  await new Promise<void>(resolve => setImmediate(resolve));
  expect(await loadLocalData()).toEqual({
    user: 'alumno',
    tasks: store.getState().tasks,
  });
  store.dispatch(logout());
  await new Promise<void>(resolve => setImmediate(resolve));
  expect((await loadLocalData()).user).toBeNull();
  expect((await loadLocalData()).tasks).toHaveLength(2);
});

test('un error de lectura permite reintentar sin borrar los datos', async () => {
  jest.resetModules();
  const storage = require('@react-native-async-storage/async-storage')
    .default as jest.Mocked<typeof AsyncStorage>;
  storage.getItem.mockRejectedValueOnce(new Error('Disco no disponible'));
  const { initializeStore } =
    require('../src/store') as typeof import('../src/store');
  await expect(initializeStore(jest.fn())).rejects.toThrow(
    'Disco no disponible',
  );
  expect(storage.multiSet).not.toHaveBeenCalled();
  await expect(initializeStore(jest.fn())).resolves.toBeUndefined();
});

test('rechaza datos locales corruptos', async () => {
  const storage = require('@react-native-async-storage/async-storage')
    .default as jest.Mocked<typeof AsyncStorage>;
  const { loadLocalData } =
    require('../src/storage/localStorage') as typeof import('../src/storage/localStorage');
  await storage.setItem('@actividades/tasks', '{incorrecto');
  await expect(loadLocalData()).rejects.toThrow();
});

test('un fallo al guardar se comunica y la siguiente escritura se recupera', async () => {
  jest.resetModules();
  const storage = require('@react-native-async-storage/async-storage')
    .default as jest.Mocked<typeof AsyncStorage>;
  const { store, initializeStore } =
    require('../src/store') as typeof import('../src/store');
  const onError = jest.fn();
  await initializeStore(onError);
  storage.multiSet.mockRejectedValueOnce(new Error('Sin espacio'));
  store.dispatch(login());
  await new Promise<void>(resolve => setImmediate(resolve));
  expect(onError).toHaveBeenCalledTimes(1);
  store.dispatch(addTask('Recuperada', ''));
  await new Promise<void>(resolve => setImmediate(resolve));
  expect(await storage.getItem('@actividades/tasks')).toContain('Recuperada');
});
