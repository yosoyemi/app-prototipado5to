import React from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {ScreenProps} from '../navigation/types';
import {useAppSelector} from '../store/hooks';
import {styles} from '../styles';
export default function ProfileScreen({navigation}: ScreenProps<'Profile'>) {
  const user = useAppSelector(state => state.auth.user);
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.text}>Usuario: {user}</Text>
      <Text style={styles.text}>Estado: Sesión activa</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Regresar</Text></Pressable>
    </ScrollView>
  );
}
