import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import { styles } from '../styles';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = () => {
    if (username.trim() !== 'alumno' || password !== '1234') {
      setError('Usuario o contraseña incorrectos.');
      return;
    }
    setPassword('');
    dispatch(login());
  };
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Inicio de sesión</Text>
      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={submit}
      />
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={submit}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
