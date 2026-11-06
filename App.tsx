import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {initializeStore, store} from './src/store';
import {styles} from './src/styles';

function AppContent() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    let active = true;
    initializeStore(() => Alert.alert('Error de almacenamiento', 'No se pudieron guardar los cambios. Comprueba el espacio disponible. Se reintentará al realizar otro cambio.'))
      .then(() => { if (active) { setStatus('ready'); } })
      .catch(() => { if (active) { setStatus('error'); } });
    return () => { active = false; };
  }, [attempt]);
  if (status !== 'ready') {
    return (
      <View style={styles.center}>
        {status === 'loading' ? <ActivityIndicator color="#0066cc" accessibilityLabel="Cargando datos locales" /> : (
          <>
            <Text style={styles.text}>No se pudieron recuperar los datos locales.</Text>
            <Pressable accessibilityRole="button" style={styles.button} onPress={() => {setStatus('loading'); setAttempt(value => value + 1);}}>
              <Text style={styles.buttonText}>Reintentar</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }
  return <View style={[styles.screen, {paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}]}><AppNavigator /></View>;
}
export default function App() {
  return <Provider store={store}><SafeAreaProvider><AppContent /></SafeAreaProvider></Provider>;
}
