const API_URL = 'http://localhost:3000/auth'; 

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data;
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const signout = async () => {
  try {
    const response = await fetch(`${API_URL}/signout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to sign out');
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

