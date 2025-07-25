import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import TaskForm from '../components/TaskForm';
import { useTaskStore } from '../stores/TaskStoreContext';

/**
 * Screen for adding a new task.
 */
const TaskFormScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const store = useTaskStore();

  return (
    <View style={styles.container}>
      <AppHeader title="Add Task" />
      <TaskForm
        onSubmit={async (task) => {
          await store.addTask({
            ...task,
            id: Date.now().toString(),
            title: task.title || '',
            description: task.description || '',
            dateTime: task.dateTime || '',
            location: task.location || '',
            status: task.status || 'in_progress',
            createdAt: new Date().toISOString(),
          });
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TaskFormScreen;
