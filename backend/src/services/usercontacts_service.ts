import { app, db } from '../firebase_options';

export const retrieveUserContacts = async (userId: string) => {
    try {
      const phoneNumberRef = db.collection('usercontacts').where('userId', '==', userId);
      const snapshot = await phoneNumberRef.get();
      const userPhoneNumbers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return userPhoneNumbers;
    } catch (error) {
      console.error('Error retrieving user contacts for user', userId, ':', error);
      throw new Error('Failed to retrieve user contacts');
    }
  }

export const saveUserContactToDatabase = async (userId: string, phoneNumber: string, phoneNumberType: string) => {
    try {
      const userContactRef = db.collection('usercontacts').doc();
      await userContactRef.set({ userId, phoneNumber, phoneNumberType });
      return userContactRef.id;
    } catch (error) {
      console.error('Error saving user contact:', error);
      throw new Error('Failed to save user contact');
    }
  }

