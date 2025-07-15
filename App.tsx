import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskStoreProvider } from './src/presentation/stores/TaskStoreContext';
import { TaskStore } from './src/presentation/stores/TaskStore';
import TaskListScreen from './src/presentation/screens/TaskListScreen';
import TaskFormScreen from './src/presentation/screens/TaskFormScreen';
import TaskDetailScreen from './src/presentation/screens/TaskDetailScreen';

const Stack = createStackNavigator();
const taskStore = new TaskStore();

const App = () => (
  <TaskStoreProvider store={taskStore}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen name="TaskForm" component={TaskFormScreen} />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </TaskStoreProvider>
);

export default App;