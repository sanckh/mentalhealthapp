import { Request, Response } from 'express';
import { hasSubmittedDailyCheckin, saveCheckIn } from '../services/checkin_service';

// Submit Daily Check-in
export const submitCheckIn = async (req: Request, res: Response) => {
  const { userId, mood, general, notes, stress, sleep, activity, gratitude } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await saveCheckIn(userId, general, mood, notes, stress, sleep, activity, gratitude);
    res.status(200).json({ message: 'Check-in successful' });
  } catch (error: any) {
    console.error('Check-in submission error:', error);
    res.status(500).json({ error: 'Failed to submit check-in' });
  }
};

// Check if User Has Submitted Daily Check-in
export const getHasSubmittedDailyCheckin = async (req: Request, res: Response) => {
  const userId = req.params.userId?.toString();

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID must be a string' });
  }

  try {
    const hasSubmitted = await hasSubmittedDailyCheckin(userId);
    res.json({ hasSubmitted });
  } catch (error: any) {
    console.error('Error fetching check-in status:', error);
    res.status(500).json({ error: 'Failed to fetch daily check-in status' });
  }
};
