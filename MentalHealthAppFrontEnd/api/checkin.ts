const API_URL = 'http://localhost:3000/checkin'; 

export const submitCheckIn = async (data: {
  userId: string;
  mood: string;
  notes: string;
  stress: string;
  sleep: string;
  activity: string;
  gratitude: string;
}) => {
    const response = await fetch(`${API_URL}/submit`, {
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
    console.log("I am here")
    const response = await fetch(`${API_URL}/hassubmitteddailycheckin/${userId}`, {
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
    return data.hasSubmitted;
  };