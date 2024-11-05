const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
    });
    if (!response.ok) {
      throw new Error('Failed to fetch check-ins');
    }
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 10));
    return data.hasSubmitted;
  };

  export const getConsecutiveCheckins = async (userId: string) => {
    const response = await fetch(`${API_URL}/checkin/consecutive/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch consecutive check-ins');
    }
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 10));
    return data.consecutiveDays;
  };

  export const getRecentCheckinData = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/checkin/getrecentcheckins/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch last 7 days of check-in data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching last 7 days of check-in data:', error);
      throw error;
    }
  };
  
  