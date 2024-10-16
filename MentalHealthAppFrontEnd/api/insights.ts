import { API_URL } from '@env';

export const getPersonalizedInsights = async (userId: string) => {
    const response = await fetch(`${API_URL}/personalizedinsights/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch check-ins');
    }
    const data = await response.json();
    return data.insights;
  };