import express, { Router } from 'express';
import { addFavoriteResource, getFavoriteResources, getRecommendedResources, removeFavoriteResource } from '../controllers/recommendedResourcesController';
const router = Router();

// Route to fetch the recommended resources
router.get('/recommendedresources', getRecommendedResources);

router.post('/favorites', addFavoriteResource);

router.get('/favorites/:userId', getFavoriteResources);

router.delete('/favorites', removeFavoriteResource);

export default router;
