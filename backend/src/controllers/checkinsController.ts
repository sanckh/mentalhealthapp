import { Request, Response } from 'express';
import { saveCheckIn } from '../services/checkin_service';
import { AuthenticatedRequest } from '../middleware/authMiddleware'

export const submitCheckIn = async (req: AuthenticatedRequest, res: Response) => {
  const { mood, notes } = req.body;
  const userId = req.user?.id;

  try {
    await saveCheckIn(userId, mood, notes);
    res.status(200).json({ message: 'Check-in successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit check-in' });
  }
};
