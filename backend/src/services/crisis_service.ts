import { app, db } from '../firebase_options';

export const crisisDocuments = async () => {
  try {
    const crisisRef = db.collection('crisisdocuments');
    const snapshot = await crisisRef.get();
    const crisisDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return crisisDocs;
  } catch (error) {
    console.error('Error retrieving crisis documents:', error);
    throw new Error('Failed to retrieve crisis documents');
  }
};

