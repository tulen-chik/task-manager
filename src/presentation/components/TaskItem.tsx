import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../app/ThemeProvider';
import { Task } from '../../entities/Task';

type Props = {
  task: Task;           // The task to display
  onPress: () => void;  // Handler for when the item is pressed
};

/**
 * Renders a single task as a card with title, status, and date.
 */
const TaskItem: React.FC<Props> = ({ task, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.status, { backgroundColor: theme.colors[task.status as keyof typeof theme.colors] }]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{task.dateTime}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', marginVertical: 6, borderRadius: 10, padding: 14, elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  status: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { color: '#fff', fontSize: 12 },
  date: { color: '#888', marginTop: 4, fontSize: 13 },
});

export default TaskItem;