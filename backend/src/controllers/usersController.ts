import { updateUserDisplayNameService, uploadProfileImage } from "../services/user_service";
import { Request, Response } from "express";
import { Multer } from 'multer';


export const updateDisplayName = async (req: Request, res: Response) => {
  const { displayName } = req.body;
  const userId = req.params.userId?.toString();
  try {
    await updateUserDisplayNameService(userId, displayName);
    res.status(200).json({ message: 'Display Name updated successfully' });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ message: 'Failed to update display name' });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await uploadProfileImage(userId, file);

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error in updateProfilePicture controller:', error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
};

