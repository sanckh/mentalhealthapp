import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';

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
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.buttonContainer, isLoading && styles.loading]}
      disabled={isLoading}>
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'gray',
    borderRadius: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginTop: 12,
  },
  buttonText: {
    color: '#11181C',
    fontSize: 18,
  },
  loading: {
    opacity: 0.5,
  },
});

export default Button;
