// CrisisScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import * as Linking from 'expo-linking';
import Icon from "react-native-vector-icons/MaterialIcons";
import { getCrisisDocuments } from "../../api/crisis";
import { crisisDocumentModel } from "@/models/crisisDocumentModel";
import { userContactModel } from "@/models/userContactModel";
import { getUserContacts } from "@/api/userContacts";
import { getCurrentUser } from "@/api/auth";
import { useThemeContext } from "@/components/ThemeContext";
import { colors } from '../theme/colors';
import RemoveCrisisContactModal from "@/components/RemoveCrisisContactModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const CrisisScreen = () => {
  const { theme } = useThemeContext();
  const styles = createStyles(theme);

  const [crisisDocuments, setCrisisDocuments] = useState<
    crisisDocumentModel[] | null
  >(null);
  const [userContacts, setUserContacts] = useState<userContactModel[] | null>(
    null
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<userContactModel | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const [documents, contacts] = await Promise.all([
          getCrisisDocuments(),
          getUserContacts(currentUser.uid),
        ]);

        setCrisisDocuments(documents);
        setUserContacts(contacts);
      } catch (error) {
        console.error("Error initializing crisis screen:", error);
        Alert.alert(
          "Initialization Error",
          "There was a problem loading the crisis resources. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Call Error", "Unable to make a call at this time.")
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.header}>Crisis Support</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {userContacts && userContacts.length > 0 ? (
          <>
            <View style={styles.buttonContainer}>
              {userContacts.map((contact, index) => (
                <CallButton
                  key={index}
                  iconName="person"
                  title={contact.contactName}
                  phoneNumber={contact.phoneNumber}
                  onPress={() => makePhoneCall(contact.phoneNumber)}
                  onDelete={() => {
                    setSelectedContact(contact);
                    setRemoveModalVisible(true);
                  }}
                  styles={styles}
                />
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No emergency contacts added yet.</Text>
        )}

        <View style={[styles.buttonContainer, { marginTop: 20 }]}>
          <CallButton
            iconName="phone"
            title="Suicide Hotline"
            phoneNumber="1234567890"
            onPress={() => makePhoneCall("1234567890")}
            styles={styles}
          />
          <CallButton
            iconName="local-hospital"
            title="Emergency Services"
            phoneNumber="911"
            onPress={() => makePhoneCall("911")}
            styles={styles}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Crisis Documents</Text>
        {crisisDocuments && crisisDocuments.length > 0 ? (
          <View style={styles.cardGrid}>
            {crisisDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                styles={styles} />
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>
            No documents available at the moment.
          </Text>
        )}
      </View>
      {user && selectedContact && (
        <RemoveCrisisContactModal
          visible={removeModalVisible}
          onClose={() => {
            setRemoveModalVisible(false);
            setSelectedContact(null);
          }}
          userId={user.uid}
          onContactRemoved={() => {
            Alert.alert('Contact Removed');
            getUserContacts(user.uid).then(contacts => setUserContacts(contacts));
            setSelectedContact(null);
          }}
        />
      )}
    </ScrollView>
  );
};

interface CallButtonProps {
  iconName: string;
  title: string;
  phoneNumber: string;
  onPress: () => void;
  onDelete?: () => void;  // Optional delete function
  styles: any;
}

const CallButton: React.FC<CallButtonProps> = ({
  iconName,
  title,
  onPress,
  onDelete,
  styles
}) => (
  <TouchableOpacity
    style={styles.callButton}
    onPress={onPress}
    accessibilityLabel={title}
  >
    <Icon name={iconName} size={20} color="#fff" style={styles.buttonIcon} />
    <Text style={styles.buttonText}>{title}</Text>
    {onDelete && (
      <TouchableOpacity 
        onPress={onDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="delete" size={20} color="#fff" />
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

interface DocumentCardProps {
  document: crisisDocumentModel;
  styles: any;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, styles }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => Linking.openURL(document.link)}
    accessibilityLabel={`Read more about ${document.title}`}
  >
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{document.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>
        {document.description}
      </Text>
    </View>
    <Icon
      name="arrow-forward-ios"
      size={16}
      color="#6200EE"
      style={styles.cardIcon}
    />
  </TouchableOpacity>
);

const createStyles = (theme: string) => {
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: themeColors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.error, // Using error color for emergency buttons
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
      width: '100%',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonIcon: {
      marginRight: 8,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
    deleteButton: {
      position: 'absolute',
      right: 10,
      padding: 5,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      width: CARD_WIDTH,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: 14,
      color: themeColors.textSecondary,
      marginBottom: 8,
    },
    cardIcon: {
      color: themeColors.primary,
      alignSelf: 'flex-end',
    },
    noDataText: {
      fontSize: 16,
      color: themeColors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
    },
  });
};

export default CrisisScreen;
