import { insightModel } from '@/models/insightModel';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeContext } from '../ThemeContext';
import { colors } from '../../app/theme/colors';

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
      padding: 20,
    },
    modalContent: {
      backgroundColor: themeColors.surface,
      borderRadius: 10,
      padding: 20,
      width: '100%',
      maxWidth: 500,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: themeColors.text,
    },
    modalCategory: {
      fontSize: 16,
      color: themeColors.textSecondary,
      marginBottom: 15,
    },
    modalDescription: {
      fontSize: 16,
      marginBottom: 15,
      lineHeight: 24,
      color: themeColors.text,
    },
    modalMoreInfo: {
      fontSize: 14,
      marginBottom: 20,
      color: themeColors.textSecondary,
      lineHeight: 20,
    },
    closeButton: {
      backgroundColor: themeColors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
};

export default InsightModal;
