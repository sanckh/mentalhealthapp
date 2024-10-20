import { Request, Response } from 'express';
import { crisisDocuments } from '../services/crisis_service';
export const getCrisisDocuments = async (req: Request, res: Response) => {
    const crisisDocs = await crisisDocuments();
    res.json({ crisisDocs });
  }