import { Request, Response } from 'express';
import { hasSubmittedDailyCheckin, saveCheckIn } from '../services/checkin_service';

export const submitCheckIn = async (req: Request, res: Response) => {
  const { userId, mood, general, notes, stress, sleep, activity, gratitude } = req.body;

  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    await saveCheckIn(userId, general, mood, notes, stress, sleep, activity, gratitude);
    res.status(200).json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit check-in' });
  }
};

export const getHasSubmittedDailyCheckin = async (req: Request, res: Response) => {
  const userId = req.params.userId?.toString();
  if (!userId || typeof userId !== 'string') {
    throw new Error('User ID must be a string');
  }
  const hasSubmitted = await hasSubmittedDailyCheckin(userId);
  res.json({ hasSubmitted });
}
