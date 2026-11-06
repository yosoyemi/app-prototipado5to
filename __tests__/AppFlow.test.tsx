import React from 'react';
import {
  act,
  configure,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import { store } from '../src/store';
import { deleteTask } from '../src/store/tasksSlice';

test('login, tareas, filtros, detalle, perfil y cierre de sesión', async () => {
  configure({ defaultIncludeHiddenElements: true, asyncUtilTimeout: 10000 });
  render(<App />);
  await act(async () => {});
  await screen.findByLabelText('Usuario');
  fireEvent.changeText(screen.getByLabelText('Usuario'), 'incorrecto');
  fireEvent.changeText(screen.getByLabelText('Contraseña'), '0000');
  fireEvent.press(screen.getByText('Iniciar sesión'));
  expect(screen.getByText('Usuario o contraseña incorrectos.')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Usuario'), 'alumno');
  fireEvent.changeText(screen.getByLabelText('Contraseña'), '1234');
  fireEvent.press(screen.getByText('Iniciar sesión'));
  fireEvent.press(await screen.findByText('Ver tareas'));
  const sessionToken = store.getState().auth.token;
  expect(sessionToken).toMatch(/^[a-f0-9]{64}$/);
  await waitFor(async () => {
    const session = JSON.parse(
      (await AsyncStorage.getItem('@actividades/session'))!,
    );
    expect(session).toEqual({ user: 'alumno', token: sessionToken });
  });
  fireEvent.press(await screen.findByText('Agregar tarea'));
  expect(screen.getByText('Escribe un título para la tarea.')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Título'), 'Estudiar Redux');
  fireEvent.changeText(
    screen.getByLabelText('Descripción'),
    'Repasar acciones',
  );
  fireEvent.press(screen.getByText('Agregar tarea'));
  fireEvent.press(await screen.findByText('Marcar completada'));
  fireEvent.changeText(screen.getByLabelText('Título'), 'Leer TypeScript');
  fireEvent.press(screen.getByText('Agregar tarea'));
  fireEvent.changeText(screen.getByLabelText('Buscar por título'), 'REDUX');
  fireEvent.press(screen.getByText('Pendientes'));
  expect(await screen.findByText('No se encontraron tareas')).toBeTruthy();
  fireEvent.press(screen.getByText('Completadas'));
  expect(await screen.findByText('Estudiar Redux')).toBeTruthy();
  fireEvent.press(screen.getByText('Ver detalle'));
  expect(await screen.findByText('Repasar acciones')).toBeTruthy();
  const taskId = store.getState().tasks[0].id;
  act(() => {
    store.dispatch(deleteTask(taskId));
  });
  expect(await screen.findByText('La tarea ya no existe.')).toBeTruthy();
  fireEvent.press(screen.getAllByText('Regresar').slice(-1)[0]);
  fireEvent.changeText(await screen.findByLabelText('Buscar por título'), '');
  fireEvent.press(screen.getByText('Todas'));
  fireEvent.press(await screen.findByText('Marcar completada'));
  fireEvent.press(await screen.findByText('Marcar pendiente'));
  fireEvent.press(screen.getByText('Eliminar'));
  expect(await screen.findByText('No se encontraron tareas')).toBeTruthy();
  fireEvent.press(screen.getByText('Regresar'));
  fireEvent.press(await screen.findByText('Mi perfil'));
  expect(await screen.findByText('Usuario: alumno')).toBeTruthy();
  fireEvent.press(screen.getByText('Regresar'));
  fireEvent.press(await screen.findByText('Cerrar sesión'));
  await screen.findByLabelText('Usuario');
  expect(store.getState().auth.isAuthenticated).toBe(false);
  await waitFor(async () => {
    expect(await AsyncStorage.getItem('@actividades/session')).toBeNull();
    expect(await AsyncStorage.getItem('@actividades/tasks')).toBe('[]');
  });
  expect(
    JSON.stringify(jest.mocked(AsyncStorage.multiSet).mock.calls),
  ).not.toContain('password');
  expect(store.getState().auth.token).toBeNull();
});
