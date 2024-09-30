import { app, db } from '../firebase_options';
import admin from 'firebase-admin';
import { Averages } from '../interfaces/averages';
import { CheckinData } from '../interfaces/checkinData';

export const saveCheckIn = async (
  userId: string,
  general: string,
  mood: number,
  notes: string,
  stress: number,
  sleep: number,
  activity: number,
  gratitude: string
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
    console.log(`Check-in saved for user ${userId}`);
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw new Error('Failed to save check-in');
  }
};

export const hasSubmittedDailyCheckin = async (userId: string) => {
  //This sets today and tomorrow to midnight to check if a user
  //has submitted a checkin on that day
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


/**
 * Fetches user check-in data for a specific number of days.
 * @param userId - The ID of the user.
 * @param days - Number of days to fetch data for.
 * @returns Promise of an array of check-in data.
 */
export async function getUserCheckinData(userId: string, days: number): Promise<CheckinData[]> {
    const checkinRef = db.collection('checkins');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    // Query the `checkins` collection where the userId matches and date is within the specified range
    const snapshot = await checkinRef
      .where('userId', '==', userId)
      .where('timestamp', '>=', startDate)
      .get();
  
    if (snapshot.empty) {
      console.log('No matching documents.');
      return [];
    }
  
    const checkinData: CheckinData[] = [];
    snapshot.forEach(doc => checkinData.push(doc.data() as CheckinData));
  
    return checkinData;
  }
  
  /**
   * Calculates the average for each metric (mood, stress, sleep, activity).
   * @param checkinData - Array of check-in data.
   * @returns Object containing averages for each metric.
   */
  export function calculateAverages(checkinData: CheckinData[]): Averages {
    const totals = { mood: 0, stress: 0, sleep: 0, activity: 0 };
    const count = { mood: 0, stress: 0, sleep: 0, activity: 0 };
  
    checkinData.forEach(checkin => {
      console.log(typeof checkin.mood);
      if (checkin.mood !== undefined) {
        totals.mood += checkin.mood;
        count.mood += 1;
      }
      if (checkin.stress !== undefined) {
        totals.stress += checkin.stress;
        count.stress += 1;
      }
      if (checkin.sleep !== undefined) {
        totals.sleep += checkin.sleep;
        count.sleep += 1;
      }
      if (checkin.activity !== undefined) {
        totals.activity += checkin.activity;
        count.activity += 1;
      }
    });
  
    return {
      mood: count.mood ? Math.round(totals.mood / count.mood) : 0,
      stress: count.stress ? Math.round(totals.stress / count.stress) : 0,
      sleep: count.sleep ? Math.round(totals.sleep / count.sleep) : 0,
      activity: count.activity ? Math.round(totals.activity / count.activity) : 0,
    };
  }