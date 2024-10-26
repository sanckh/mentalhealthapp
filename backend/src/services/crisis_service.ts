import { app, db } from '../firebase_options';
import { logToFirestore } from './logs_service';

export const crisisDocuments = async () => {
  try {
    const crisisRef = db.collection('crisisdocuments');
    const snapshot = await crisisRef.get();
    const crisisDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return crisisDocs;

  } catch (error: any) {
    console.error('Error retrieving crisis documents:', error);

    await logToFirestore({
      eventType: 'ERROR',
      message: 'Firestore query failed for crisis documents',
      data: { error: error.message },
      timestamp: new Date().toISOString(),
    });
    
    throw new Error('Failed to retrieve crisis documents');
  }
};

