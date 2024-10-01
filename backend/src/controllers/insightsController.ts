import { Request, Response } from 'express';
import { getUserCheckinData, calculateAverages } from '../services/checkin_service';
import { getPersonalizedInsights, evaluateInsights } from '../services/insight_service';

/**
 * Controller method to fetch and return personalized insights for a user.
 */
export const getUserPersonalizedInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId?.toString();
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    // Step 1: Fetch user check-in data for the last week
    const checkinData = await getUserCheckinData(userId, 7);

    // Step 2: Calculate averages for the user's metrics
    const averages =  calculateAverages(checkinData);

    // Step 3: Fetch all available insights
    const insights = await getPersonalizedInsights();

    // Step 4: Evaluate which insights apply to the user
    const applicableInsights = evaluateInsights(averages, insights);

    // Step 5: Return the applicable insights
    res.json({ insights: applicableInsights });
  } catch (error) {
    console.error('Error fetching personalized insights:', error);
    res.status(500).json({ message: 'Error fetching personalized insights' });
  }
};
