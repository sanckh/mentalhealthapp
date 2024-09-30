import { app, db } from '../firebase_options';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import admin from 'firebase-admin';

export const saveUserToFirestore = async (userData: { uid: string; email: string }) => {
    await addDoc(collection(getFirestore(app), 'users'), userData);
  };
