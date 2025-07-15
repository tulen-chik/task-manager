import React from 'react';
import { View } from 'react-native';
import AppHeader from '../components/AppHeader';
import TaskList from '../components/TaskList';
import PrimaryButton from '../components/PrimaryButton';
import { useTaskStore } from '../stores/TaskStoreContext';

/**
 * Main screen displaying the list of tasks and add button.
 */
const TaskListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const store = useTaskStore();

  React.useEffect(() => {
    store.loadTasks();
  }, [store]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Tasks" />
      <TaskList
        tasks={store.tasks}
        onTaskPress={task => navigation.navigate('TaskDetail', { taskId: task.id })}
      />
      <PrimaryButton
        title="Add Task"
        onPress={() => navigation.navigate('TaskForm')}
        style={{ position: 'absolute', bottom: 24, right: 24, left: 24 }}
      />
    </View>
  );
};

export default TaskListScreen;