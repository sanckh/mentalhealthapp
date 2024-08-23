import express from 'express';
import { getUserPersonalizedInsights } from '../controllers/insightsController';

const router = express.Router();

// Define the route to get personalized insights for a user
router.get('/personalizedinsights/:userId', getUserPersonalizedInsights);

export default router;
