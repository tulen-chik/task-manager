import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../app/ThemeProvider';

type Props = {
  title: string;           // Button label
  onPress: () => void;     // Click handler
  style?: any;             // Optional custom styles
};

/**
 * A reusable primary button with app theme color.
 */
const PrimaryButton: React.FC<Props> = ({ title, onPress, style }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginVertical: 8 },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PrimaryButton;
