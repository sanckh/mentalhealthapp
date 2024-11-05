import express, { Router } from 'express';
import { addFavoriteResource, getFavoriteResources, getRecommendedResources, removeFavoriteResource } from '../controllers/recommendedResourcesController';
const router = Router();

// Route to fetch the recommended resources
router.get('/recommendedresources', getRecommendedResources);

router.post('/addfavouriteresource', addFavoriteResource);

router.get('/getfavoriteresources/:userId', getFavoriteResources);

router.delete('/removefavoriteresource', removeFavoriteResource);

export default router;
