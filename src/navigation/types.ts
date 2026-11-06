import {NativeStackScreenProps} from '@react-navigation/native-stack';
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Tasks: undefined;
  TaskDetail: {taskId: string};
  Profile: undefined;
};
export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
