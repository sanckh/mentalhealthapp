export const submitCheckIn = async (mood: string, notes: string) => {
    const response = await fetch('http://localhost:3000/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ mood, notes }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit check-in');
    }
    return response.json();
  };