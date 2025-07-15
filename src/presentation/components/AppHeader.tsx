import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../app/ThemeProvider';

type Props = { title: string }; // Header title

/**
 * Displays the app header with a title and theme color.
 */
const AppHeader: React.FC<Props> = ({ title }) => {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 40, paddingBottom: 16, alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});

export default AppHeader;