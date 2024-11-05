import { Request, Response } from 'express';
import { logToFirestore } from '../services/logs_service';
import { addResourceToFavorites, fetchFavoriteResources, fetchRecommendedResources, removeResourceFromFavorites } from '../services/recommendedresources_service';

export const getRecommendedResources = async (req: Request, res: Response) => {
  try {
    const resources = await fetchRecommendedResources();
    res.json({resources});
  } catch (error) {
    console.error('Error in recommended resources controller:', error);
    res.status(500).json({ error: 'Failed to fetch recommended resources.' });
  }
};

export const addFavoriteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, resourceId } = req.body;
    await addResourceToFavorites(userId, resourceId);
    res.status(201).send({ message: 'Resource added to favorites successfully' });
  } catch (error: any) {
    res.status(500).send({ message: 'Failed to add favorite resource', error: error.message });
  }
};

export const getFavoriteResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const resources = await fetchFavoriteResources(userId);
    res.status(200).json(resources);
  } catch (error: any) {
    res.status(500).send({ message: 'Failed to fetch favorite resources', error: error.message });
  }
};

export const removeFavoriteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, resourceId } = req.body;
    await removeResourceFromFavorites(userId, resourceId);
    res.status(200).send({ message: 'Resource removed from favorites successfully' });
  } catch (error: any) {
    res.status(500).send({ message: 'Failed to remove favorite resource', error: error.message });
  }
};
