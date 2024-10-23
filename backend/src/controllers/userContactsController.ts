import { retrieveUserContacts, saveUserContactToDatabase } from "../services/usercontacts_service";
import { Request, Response } from "express";

export const getUserContacts = async (req: Request, res: Response) => {
    const userId = req.params.userId?.toString();
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a string');
    }
    const userPhoneNumbers = await retrieveUserContacts(userId);
    res.json({ userPhoneNumbers });
}

export const saveUserContact = async (req: Request, res: Response) => {
  const userId = req.params.userId?.toString();
    const { phoneNumber, phoneNumberType } = req.body;
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    if (!phoneNumberType) {
      throw new Error('Phone number type is required');
    }
    const contactId = await saveUserContactToDatabase(userId, phoneNumber, phoneNumberType);
    res.json({ contactId });
}