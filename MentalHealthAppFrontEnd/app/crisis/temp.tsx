// CrisisScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getCrisisDocuments } from '../../api/crisis';
import { getUserContacts } from '@/api/userContacts';
import { getCurrentUser } from '@/api/auth';

const { width: viewportWidth } = Dimensions.get('window');

const CrisisScreen = () => {
  const [crisisDocuments, setCrisisDocuments] = useState<any[]>([]);
  const [userContacts, setUserContacts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);

        const crisisDocs = await getCrisisDocuments();
        setCrisisDocuments(crisisDocs);

        const contacts = await getUserContacts(user.uid);
        setUserContacts(contacts);
      } catch (error) {
        console.error('Error initializing crisis screen:', error);
      }
    };
    initialize();
  }, []);

  const makePhoneCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Crisis Support</Text>

      <View style={styles.buttonContainer}>
      <View style={styles.row}>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => makePhoneCall('1234567890')}
      >
        <Text style={styles.buttonText}>Suicide Hotline</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.callButton}
        onPress={() => makePhoneCall('911')}
      >
        <Text style={styles.buttonText}>Emergency Services</Text>
      </TouchableOpacity>
    </View>

    {/* Dynamically Loaded Contacts */}
    {userContacts.length > 0 && (
      <View style={styles.contactContainer}>
        {userContacts.map((contact: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.callButton}
            onPress={() => makePhoneCall(contact.phoneNumber)}
          >
            <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail">
              {contact.contactName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
      </View>

      {crisisDocuments.length > 0 && (
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselHeader}>Helpful Resources</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {crisisDocuments.map((doc: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(doc.link)}
                style={styles.carouselCard}
              >
                <Text style={styles.cardTitle}>{doc.title}</Text>
                <Text style={styles.cardDescription}>{doc.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  callButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 8,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  carouselContainer: {
    marginTop: 20,
  },
  carouselHeader: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  carousel: {
    paddingLeft: 16,
  },
  carouselCard: {
    width: 600,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },
});


export default CrisisScreen;
