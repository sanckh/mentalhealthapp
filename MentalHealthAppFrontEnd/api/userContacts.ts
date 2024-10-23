import { API_URL } from '@env';

export const getUserContacts = async (userId: string) => {
    const response = await fetch(`${API_URL}/contacts/getusercontacts/${userId}`, {
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
    return data.userContacts;
  };

export const saveUserContact = async (userId: string, phoneNumber: string, phoneNumberType: string) => {
    const response = await fetch(`${API_URL}/contacts/saveusercontact/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ phoneNumber, phoneNumberType }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch personalized insights');
    }
    const data = await response.json();
    return data;
  };