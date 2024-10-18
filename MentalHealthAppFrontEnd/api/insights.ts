import { API_URL } from '@env';

export const getPersonalizedInsights = async (userId: string) => {
    const response = await fetch(`${API_URL}/insight/personalizedinsights/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch personalized insights');
    }
    const data = await response.json();
    return data.insights;
  };