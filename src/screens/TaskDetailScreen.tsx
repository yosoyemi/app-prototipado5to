import React from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {ScreenProps} from '../navigation/types';
import {useAppSelector} from '../store/hooks';
import {styles} from '../styles';
export default function TaskDetailScreen({navigation, route}: ScreenProps<'TaskDetail'>) {
  const task = useAppSelector(state => state.tasks.find(item => item.id === route.params.taskId));
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {task ? <>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.text}>{task.description || 'Sin descripción'}</Text>
        <Text style={styles.text}>Estado: {task.completed ? 'Completada' : 'Pendiente'}</Text>
      </> : <Text style={styles.text}>La tarea ya no existe.</Text>}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => navigation.goBack()}><Text style={styles.buttonText}>Regresar</Text></Pressable>
    </ScrollView>
  );
}
