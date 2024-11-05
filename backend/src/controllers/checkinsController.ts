import { Request, Response } from 'express';
import { getUserCheckinData, getUserCheckinDataAllTime, hasSubmittedDailyCheckin, saveCheckIn } from '../services/checkin_service';
import { logToFirestore } from '../services/logs_service';

// Submit Daily Check-in
export const submitCheckIn = async (req: Request, res: Response) => {
  const { userId, mood, general, notes, stress, sleep, activity, gratitude } = req.body;

  if (!userId) {
    await logToFirestore({
      eventType: 'ERROR',
      message: 'User ID missing in check-in submission',
      data: { body: req.body },
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await saveCheckIn(userId, general, mood, notes, stress, sleep, activity, gratitude);
    res.status(200).json({ message: 'Check-in successful' });
  } catch (error: any) {
    console.error('Check-in submission error:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Check-in submission failed',
      data: { error: error.message, userId },
      timestamp: new Date().toISOString(),
    });
    
    res.status(500).json({ error: 'Failed to submit check-in' });
  }
};

// Check if User Has Submitted Daily Check-in
export const getHasSubmittedDailyCheckin = async (req: Request, res: Response) => {
  const userId = req.params.userId?.toString();

  if (!userId || typeof userId !== 'string') {
    await logToFirestore({
      eventType: 'ERROR',
      message: 'Invalid or missing user ID in daily check-in status request',
      data: { params: req.params },
      timestamp: new Date().toISOString(),
    });

    return res.status(400).json({ error: 'User ID must be a string' });
  }

  try {
    const hasSubmitted = await hasSubmittedDailyCheckin(userId);
    res.json({ hasSubmitted });
  } catch (error: any) {
    console.error('Error fetching check-in status:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch daily check-in status',
      data: { error: error.message, userId },
      timestamp: new Date().toISOString(),
    });
    
    res.status(500).json({ error: 'Failed to fetch daily check-in status' });
  }
};

export const getConsecutiveCheckins = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
      const checkins = await getUserCheckinDataAllTime(userId);

      if (!checkins.length) {
          return res.status(200).json({ consecutiveDays: 0 });
      }

      let consecutiveDays = 1;

      for (let i = 0; i < checkins.length - 1; i++) {
        if (!checkins[i].timestamp || !checkins[i + 1].timestamp) {
          throw new Error(`Missing timestamp field in one or more check-in records`);
        }

        // Create Date objects without time components
        const currentDate = new Date(checkins[i].timestamp.toDate());
        const nextDate = new Date(checkins[i + 1].timestamp.toDate());

        // Set time components to 0 for date-only comparison
        currentDate.setHours(0, 0, 0, 0);
        nextDate.setHours(0, 0, 0, 0);

        // Calculate the difference in days
        const difference = Math.round((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

        if (difference === 1) {
              consecutiveDays++;
          } else {
              break;
          }
      }

      res.status(200).json({ consecutiveDays });
  } catch (error: any) {
      console.error('Error processing consecutive check-ins:', error);
      res.status(500).json({ error: error.message });
  }
};

export const getRecentCheckinData = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const days = 7;

  try {
    const checkinData = await getUserCheckinData(userId, days);
    res.status(200).json(checkinData);
  } catch (error: any) {
    console.error('Error fetching last 7 days of check-in data:', error);
    res.status(500).json({ error: error.message });
  }
};


