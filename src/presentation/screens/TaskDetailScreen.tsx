import React from 'react';
import { View, Text } from 'react-native';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import { useTaskStore } from '../stores/TaskStoreContext';

/**
 * Screen for viewing and deleting a single task.
 */
const TaskDetailScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const store = useTaskStore();
  const task = store.getTaskById(route.params.taskId);

  if (!task) return <Text>Task not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title={task.title} />
      <Text>{task.description}</Text>
      <Text>{task.dateTime}</Text>
      <Text>{task.location}</Text>
      <Text>{task.status}</Text>
      <PrimaryButton
        title="Delete"
        onPress={async () => {
          await store.deleteTask(task.id);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default TaskDetailScreen;