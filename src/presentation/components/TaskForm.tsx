import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { Task } from '../../entities/Task';

type Props = {
  initial?: Partial<Task>;                  // Initial values for editing
  onSubmit: (task: Partial<Task>) => void;  // Handler for form submission
};

/**
 * Form for creating or editing a task.
 */
const TaskForm: React.FC<Props> = ({ initial = {}, onSubmit }) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [dateTime, setDateTime] = useState(initial.dateTime || '');
  const [location, setLocation] = useState(initial.location || '');

  return (
    <View>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Date and Time" value={dateTime} onChangeText={setDateTime} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <PrimaryButton title="Save" onPress={() => onSubmit({ title, description, dateTime, location })} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 6, fontSize: 15 },
});

export default TaskForm;