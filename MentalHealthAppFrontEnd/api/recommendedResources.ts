import { recommendedResourceModel } from "@/models/recommendedResourceModel";

const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const getRecommendedResources = async () => {
    const response = await fetch(`${API_URL}/resources/recommendedresources`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recommended resources');
    }
    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 10));
    return data.resources;
  };

  export async function addFavoriteResource(userId: string, resourceId: string): Promise<void> {
    const response = await fetch(`${API_URL}/resources/addfavouriteresource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, resourceId }),
    });
    if (!response.ok) {
      throw new Error('Failed to add favorite resource');
    }
  }
  
  export async function getFavoriteResources(userId: string): Promise<recommendedResourceModel[]> {
    const response = await fetch(`${API_URL}/resources/getfavoriteresources/${userId}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch favorite resources');
    }
    return response.json();
  }

export async function removeFavoriteResource(userId: string, resourceId: string): Promise<void> {
  const response = await fetch(`${API_URL}/resources/removefavoriteresource`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, resourceId }),
  });

  if (!response.ok) {
    throw new Error('Failed to remove favorite resource');
  }
}
