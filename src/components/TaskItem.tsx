import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles';
interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenDetail: (id: string) => void;
}
export default function TaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
  onOpenDetail,
}: TaskItemProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.label, completed && styles.completed]}>{title}</Text>
      <Text style={styles.text}>
        Estado: {completed ? 'Completada' : 'Pendiente'}
      </Text>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => onToggle(id)}
      >
        <Text style={styles.buttonText}>
          {completed ? 'Marcar pendiente' : 'Marcar completada'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => onOpenDetail(id)}
      >
        <Text style={styles.buttonText}>Ver detalle</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.buttonText}>Eliminar</Text>
      </Pressable>
    </View>
  );
}
