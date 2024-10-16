import React from 'react';
import { Text, StyleSheet, TextStyle, Pressable } from 'react-native';

type ButtonProps = {
  title: string;
  handlePress: () => void;
  textStyles?: TextStyle;
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  title,
  handlePress,
  textStyles,
  isLoading,
}) => {
  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, isLoading && styles.loading]}
      disabled={isLoading}>
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    color: '#11181C',
    fontSize: 18,
  },
  loading: {
    opacity: 0.5,
  },
});

export default Button;
