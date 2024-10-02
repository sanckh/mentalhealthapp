import { app, db } from '../firebase_options';
import admin from 'firebase-admin';

/**
 * Fetches a user from the 'users' collection.
 * @param uid - The UID of the user to fetch.
 * @returns Promise of the user document.
 */
export async function getAdditionalUserInfo(uid: string) {
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('uid', '==', uid).get();

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as { name: string } | undefined;
        return {
            name: userData?.name,
        };
    } else {
        throw new Error('User not found');
    }
}