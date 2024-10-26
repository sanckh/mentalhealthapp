import { Request, Response } from 'express';
import { crisisDocuments } from '../services/crisis_service';
import { logToFirestore } from '../services/logs_service';

export const getCrisisDocuments = async (req: Request, res: Response) => {
  try {
    const crisisDocs = await crisisDocuments();

    res.json({ crisisDocs });
  } catch (error: any) {
    console.error('Error retrieving crisis documents:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to retrieve crisis documents',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({ error: 'Failed to retrieve crisis documents' });
  }
};
