import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <AppHeader title="Tasks" />
      <TaskList
        tasks={store.tasks}
        onTaskPress={task => navigation.navigate('TaskDetail', { taskId: task.id })}
      />
      <PrimaryButton
        title="Add Task"
        onPress={() => navigation.navigate('TaskForm')}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  addButton: { position: 'absolute', bottom: 24, right: 24, left: 24 },
});

export default TaskListScreen;