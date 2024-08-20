import { app, db } from '../firebase_options';
import admin from 'firebase-admin';

export const saveCheckIn = async (
  userId: string,
  mood: string,
  notes: string,
  stress: string,
  sleep: string,
  activity: string,
  gratitude: string
) => {
  try {
    const checkInData = {
      userId,
      mood,
      notes,
      stress,
      sleep,
      activity,
      gratitude,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('checkins').add(checkInData);
    console.log(`Check-in saved for user ${userId}`);
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw new Error('Failed to save check-in');
  }
};

export const hasSubmittedDailyCheckin = async (userId: string) => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const query = db.collection('checkins')
  .where('userId', '==', userId)
  .where('timestamp', '>=', today)
  .where('timestamp', '<', tomorrow);
const querySnapshot = await query.get();
return querySnapshot.docs.length > 0;
};
  