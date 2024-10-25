import { Request, Response } from 'express';
import { logToFirestore } from '../services/logs_service';

export const logEvent = async (req: Request, res: Response) => {
  try {
    const { eventType, message, data, timestamp } = req.body;

    if (!eventType || !message) {
      return res.status(400).json({ error: 'Invalid log entry' });
    }

    // Send log to the service layer
    await logToFirestore({ eventType, message, data, timestamp });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ error: 'Failed to log event' });
  }
};
