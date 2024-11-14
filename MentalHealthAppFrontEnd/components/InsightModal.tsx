import { insightModel } from '@/models/insightModel';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeContext } from './ThemeContext';
import { colors } from '../app/theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  insight: insightModel;
}

const InsightModal: React.FC<Props> = ({ visible, onClose, insight }) => {
  if (!insight) return null;
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{insight.title}</Text>
          <Text style={styles.modalCategory}>{insight.category}</Text>
          <Text style={styles.modalDescription}>{insight.description}</Text>
          <Text style={styles.modalMoreInfo}>{insight.moreinformation}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.surface,
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: 10,
    },
    modalCategory: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 5,
    },
    modalDescription: {
      fontSize: 14,
      color: themeColors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    modalMoreInfo: {
      fontSize: 12,
      color: themeColors.textTertiary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: 20,
    },
    closeButton: {
      padding: 10,
      backgroundColor: themeColors.primary,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default InsightModal;
