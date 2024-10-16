export async function GET() {
    const API_URL = 'http://localhost:3000/auth';

    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error details:', error);
      return null;
    }
  }
