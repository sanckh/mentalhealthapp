const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const updateDisplayName = async (newDisplayName: string, userId: string) => {
    const response = await fetch(`${API_URL}/user/updatedisplayname/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ displayName: newDisplayName }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update display name');
    }
  
    return await response.json();
  };

  export const updateProfilePicture = async (profilePicture: FormData, userId: string) => {
    try {
      console.log("Profile picture: ", profilePicture)
      const response = await fetch(`${API_URL}/user/updateprofilepicture/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: profilePicture,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }
  
      const data = await response.json();
      console.log('Profile image uploaded successfully:', data);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };
  
  