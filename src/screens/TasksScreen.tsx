import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import TaskItem from '../components/TaskItem';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTask, deleteTask, toggleTask } from '../store/tasksSlice';
import { Task } from '../types/task';
import { styles } from '../styles';

type Filter = 'Todas' | 'Pendientes' | 'Completadas';
const filters: Filter[] = ['Todas', 'Pendientes', 'Completadas'];
export default function TasksScreen({ navigation }: ScreenProps<'Tasks'>) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('Todas');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const query = search.trim().toLocaleLowerCase();
    setFilteredTasks(
      tasks.filter(
        task =>
          task.title.toLocaleLowerCase().includes(query) &&
          (filter === 'Todas' ||
            (filter === 'Completadas' ? task.completed : !task.completed)),
      ),
    );
  }, [tasks, search, filter]);

  const submit = () => {
    if (!title.trim()) {
      setError('Escribe un título para la tarea.');
      return;
    }
    dispatch(addTask(title, description));
    setTitle('');
    setDescription('');
    setError('');
  };
  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      data={filteredTasks}
      keyExtractor={task => task.id}
      ListHeaderComponent={
        <View style={styles.group}>
          <Text style={styles.title}>Mis tareas</Text>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="Título"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.description]}
            accessibilityLabel="Descripción"
            value={description}
            onChangeText={setDescription}
            multiline
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
            <Text style={styles.buttonText}>Agregar tarea</Text>
          </Pressable>
          <Text style={styles.label}>Buscar por título</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="Buscar por título"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          <View style={styles.row}>
            {filters.map(option => (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === option }}
                style={[
                  styles.filter,
                  filter === option && styles.selectedFilter,
                ]}
                onPress={() => setFilter(option)}
              >
                <Text
                  style={filter === option ? styles.buttonText : styles.text}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <TaskItem
          id={item.id}
          title={item.title}
          completed={item.completed}
          onToggle={id => dispatch(toggleTask(id))}
          onDelete={id => dispatch(deleteTask(id))}
          onOpenDetail={id => navigation.navigate('TaskDetail', { taskId: id })}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.text}>No se encontraron tareas</Text>
      }
      ListFooterComponent={
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Regresar</Text>
        </Pressable>
      }
    />
  );
}
