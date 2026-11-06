import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector} from '../store/hooks';
import {RootStackParamList} from './types';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = {...DefaultTheme, colors: {...DefaultTheme.colors, background: '#ffffff', text: '#000000', primary: '#0066cc'}};
export default function AppNavigator() {
  const authenticated = useAppSelector(state => state.auth.isAuthenticated);
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{animation: 'none', headerBackVisible: false, headerTintColor: '#000000', contentStyle: {backgroundColor: '#ffffff'}}}>
        {authenticated ? (
          <Stack.Group navigationKey="authenticated">
            <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Inicio'}} />
            <Stack.Screen name="Tasks" component={TasksScreen} options={{title: 'Tareas'}} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{title: 'Detalle de tarea'}} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{title: 'Mi perfil'}} />
          </Stack.Group>
        ) : <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Inicio de sesión'}} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
