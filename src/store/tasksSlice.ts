import {createSlice, nanoid, PayloadAction} from '@reduxjs/toolkit';
import {Task} from '../types/task';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [] as Task[],
  reducers: {
    addTask: {
      prepare(title: string, description: string) {
        return {payload: {id: nanoid(), title: title.trim(), description: description.trim(), completed: false}};
      },
      reducer(state, action: PayloadAction<Task>) {
        if (action.payload.title) {
          state.push(action.payload);
        }
      },
    },
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.find(item => item.id === action.payload);
      if (task) { task.completed = !task.completed; }
    },
    deleteTask(state, action: PayloadAction<string>) {
      return state.filter(task => task.id !== action.payload);
    },
    setTasks(_state, action: PayloadAction<Task[]>) { return action.payload; },
  },
});
export const {addTask, toggleTask, deleteTask, setTasks} = tasksSlice.actions;
export default tasksSlice.reducer;
