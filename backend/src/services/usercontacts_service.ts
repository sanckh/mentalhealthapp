import { app, db } from '../firebase_options';
import { logToFirestore } from './logs_service';

export const retrieveUserContacts = async (userId: string) => {
    try {
      const phoneNumberRef = db.collection('usercontacts').where('userId', '==', userId);
      const snapshot = await phoneNumberRef.get();
      const userPhoneNumbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return userPhoneNumbers;
    } catch (error: any) {
      console.error('Error retrieving user contacts for user', userId, ':', error);

      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to retrieve user contacts',
        data: { error: error.message, userId },
        timestamp: new Date().toISOString(),
      });
      
      throw new Error('Failed to retrieve user contacts');
    }
  }

export const saveUserContactToDatabase = async (userId: string, phoneNumber: string, phoneNumberType: string) => {
    try {
      const userContactRef = db.collection('usercontacts').doc();
      await userContactRef.set({ userId, phoneNumber, phoneNumberType });
      return userContactRef.id;
    } catch (error: any) {
      console.error('Error saving user contact:', error);

      await logToFirestore({
        eventType: 'ERROR',
        message: 'Failed to save user contact to database',
        data: { error: error.message, userId },
        timestamp: new Date().toISOString(),
      });

      throw new Error('Failed to save user contact');
    }
  }

