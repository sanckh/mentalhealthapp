import { db } from '../firebase_options';
import admin from 'firebase-admin';
import { logToFirestore } from '../services/logs_service';  // Import logging service

export const saveCheckIn = async (
  userId: string,
  general: string,
  mood: number,
  notes: string,
  stress: number,
  sleep: number,
  activity: number,
  gratitude: string,
  correlationId: string
) => {
  try {
    const checkInData = {
      userId,
      general,
      mood,
      notes,
      stress,
      sleep,
      activity,
      gratitude,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('checkins').add(checkInData);

    await logToFirestore({
      eventType: 'SUCCESS',
      message: 'Check-in saved successfully',
      data: { userId, correlationId },
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    console.error('Error saving check-in:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to save check-in',
      data: { error: error.message, userId, correlationId },
      timestamp: new Date().toISOString(),
      correlationId,
    });

    throw new Error('Failed to save check-in');
  }
};

export const hasSubmittedDailyCheckin = async (userId: string, correlationId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  try {
    const query = db.collection('checkins')
      .where('userId', '==', userId)
      .where('timestamp', '>=', today)
      .where('timestamp', '<', tomorrow);
    const querySnapshot = await query.get();
    const hasSubmitted = querySnapshot.docs.length > 0;

    await logToFirestore({
      eventType: 'SUCCESS',
      message: 'Fetched daily check-in status',
      data: { userId, hasSubmitted, correlationId },
      timestamp: new Date().toISOString(),
      correlationId,
    });

    return hasSubmitted;
  } catch (error: any) {
    console.error('Error fetching check-in status:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch daily check-in status',
      data: { error: error.message, userId, correlationId },
      timestamp: new Date().toISOString(),
      correlationId,
    });

    throw new Error('Failed to fetch check-in status');
  }
};
