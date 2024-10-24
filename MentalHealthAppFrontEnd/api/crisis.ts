import { API_URL } from '@env';

export const getCrisisDocuments = async () => {
    const response = await fetch(`${API_URL}/crisis/crisisdocuments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch crisis documents');
    }
    const data = await response.json();
    return data.crisisDocs;
  };