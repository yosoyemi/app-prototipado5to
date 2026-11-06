import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import { styles } from '../styles';
export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const dispatch = useAppDispatch();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pantalla principal</Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Text style={styles.buttonText}>Ver tareas</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Mi perfil</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
