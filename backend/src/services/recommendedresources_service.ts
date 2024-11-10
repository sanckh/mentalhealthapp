import { app, db } from '../firebase_options';
import { firestore } from 'firebase-admin';
import { logToFirestore } from './logs_service';
import {createCache} from 'cache-manager';
import { recommendedResources } from '../interfaces/recommendedResources';
import { favoriteResource } from '../interfaces/favoriteResource';

// Set up in-memory cache with a 24-hour expiration
const cache = createCache({ ttl: 86400000 });

const getRandomResource = (resources: recommendedResources[]) => {
  return resources[Math.floor(Math.random() * resources.length)];
};

export const fetchRecommendedResources = async (): Promise<recommendedResources[]> => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `dailyRecommendations-${today}`;

  try {
    const cachedResources = await cache.get<recommendedResources[]>(cacheKey);
    if (cachedResources) {
      return cachedResources;
    }

    const resourcesSnapshot = await firestore().collection('recommendedresources').get();

    const allResources: recommendedResources[] = resourcesSnapshot.docs.map((doc) => {
      const data = doc.data() as recommendedResources;
      return { ...data, id: doc.id }; 
    });

    const resourcesByCategory = allResources.reduce<Record<string, recommendedResources[]>>((acc, resource) => {
      if (!acc[resource.category]) acc[resource.category] = [];
      acc[resource.category].push(resource);
      return acc;
    }, {});

    const categories = Object.keys(resourcesByCategory);
    if (categories.length < 2) {
      throw new Error('Not enough categories to select two different resources.');
    }

    const shuffledCategories = categories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffledCategories.slice(0, 2);

    const selectedResources = selectedCategories.map(
      (category) => getRandomResource(resourcesByCategory[category])
    );

    await cache.set(cacheKey, selectedResources);

    return selectedResources;
  } catch (error: any) {
    console.error('Error fetching recommended resources:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch recommended resources',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });
    throw new Error('Failed to fetch recommended resources.');
  }
};


export const addResourceToFavorites = async (userId: string, resourceId: string): Promise<void> => {
  const favoriteRef = db.collection('userfavoriteresources').doc(`${userId}_${resourceId}`);

  try {
    const doc = await favoriteRef.get();

    if (!doc.exists) {
      const favoriteResource: favoriteResource = {
        id: `${userId}_${resourceId}`,
        userId,
        resourceId,
      };

      await favoriteRef.set(favoriteResource);
    } else {
      console.error(`Resource ${resourceId} is already in ${userId}'s favorites`);
    }
  } catch (error: any) {
    console.error('Error adding resource to favorites:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to add resource to favorites',
      data: { error: error.message, userId, resourceId },
      timestamp: new Date().toISOString(),
    });

    throw new Error('Failed to add resource to favorites');
  }
};

export const fetchFavoriteResources = async (userId: string): Promise<recommendedResources[]> => {
  try {
    // Step 1: Retrieve the user's favorite entries from `userfavoriteresources` to get `recommendedResourceId`s
    const snapshot = await db.collection('userfavoriteresources')
      .where('userId', '==', userId)
      .get();

    if (snapshot.empty) {
      return [];
    }

    // Step 2: Extract the `recommendedResourceId`s from the user's favorite resources
    const recommendedResourceIds = snapshot.docs.map(doc => {
      const data = doc.data() as favoriteResource;
      return data.resourceId;
    });

    // Step 3: Fetch each recommended resource by its ID in `recommendedresources`
    const resourcePromises = recommendedResourceIds.map(resourceId =>
      db.collection('recommendedresources').doc(resourceId).get()
    );

    const resourceDocs = await Promise.all(resourcePromises);

    // Step 4: Map the results to include both the recommended resource data and its `resourceId`
    const resources: recommendedResources[] = resourceDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        ...doc.data(),
        id: doc.id, // Set the `recommendedResourceId` as the `id` for each resource
      }) as recommendedResources);

    return resources;
  } catch (error: any) {
    console.error('Error fetching favorite resources:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to fetch favorite resources',
      data: { error: error.message, userId },
      timestamp: new Date().toISOString(),
    });

    throw new Error('Failed to fetch favorite resources');
  }
};

export const removeResourceFromFavorites = async (userId: string, resourceId: string): Promise<void> => {
  const favoriteRef = db.collection('userfavoriteresources').doc(`${userId}_${resourceId}`);

  try {
    const doc = await favoriteRef.get();

    if (doc.exists) {
      await favoriteRef.delete();
      console.error(`Resource ${resourceId} removed from ${userId}'s favorites`);
    } else {
      console.error(`Resource ${resourceId} was not found in ${userId}'s favorites`);
    }
  } catch (error: any) {
    console.error('Error removing resource from favorites:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Failed to remove resource from favorites',
      data: { error: error.message, userId, resourceId },
      timestamp: new Date().toISOString(),
    });

    throw new Error('Failed to remove resource from favorites');
  }
};
