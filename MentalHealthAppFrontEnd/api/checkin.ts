import { API_URL } from '@env';

export const submitCheckIn = async (data: {
  userId: string;
  general: string;
  mood: number;
  notes: string;
  stress: number;
  sleep: number;
  activity: number;
  gratitude: string;
}) => {
    const response = await fetch(`${API_URL}/checkin/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...data }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit check-in');
    }
    return response.json();
  };

  export const hasSubmittedDailyCheckin = async (userId: string) => {
    const response = await fetch(`${API_URL}/checkin/hassubmitteddailycheckin/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to fetch check-ins');
    }
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 0));
    return data.hasSubmitted;
  };