import { userContacts } from "../services/usercontacts_service";
import { Request, Response } from "express";

export const getUserContacts = async (req: Request, res: Response) => {
    const userId = req.params.userId?.toString();
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a string');
    }
    const userPhoneNumbers = await userContacts(userId);
    res.json({ userPhoneNumbers });
}