import React from 'react';
import { FlatList } from 'react-native';
import TaskItem from './TaskItem';
import { Task } from '../../entities/Task';

type Props = {
  tasks: Task[];                        // Array of tasks to display
  onTaskPress: (task: Task) => void;    // Handler for when a task is pressed
};

/**
 * Renders a scrollable list of tasks using TaskItem.
 */
const TaskList: React.FC<Props> = ({ tasks, onTaskPress }) => (
  <FlatList
    data={tasks}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <TaskItem task={item} onPress={() => onTaskPress(item)} />
    )}
    contentContainerStyle={{ padding: 12 }}
  />
);

export default TaskList;
