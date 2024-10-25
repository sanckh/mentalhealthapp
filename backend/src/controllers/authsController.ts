import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Request, Response } from 'express';
import { app } from '../firebase_options';
import { getAdditionalUserInfo, saveUserToFirestore } from '../services/user_service';

const auth = getAuth(app);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!email) {
            res.status(400).send({ error: 'Email is required' });
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email ?? '', password);

        if (!userCredential.user.email) {
            throw new Error('Email is required');
        }
        const userData = {
            uid: userCredential.user.uid,
            name: name,
            email: userCredential.user.email,
        };

        await saveUserToFirestore(userData);

        res.status(201).send({ uid: userCredential.user.uid });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      res.status(200).send({ uid: userCredential.user.uid, token });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  export const signout = async (req: Request, res: Response) => {
    try {
        await auth.signOut();
        res.status(200).send({ message: 'User signed out' });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
  }

export const getUserInfo = async (uid: string) => {
    try {
        const userInfo = await getAdditionalUserInfo(uid);

        return { uid, ...userInfo };
    } catch (error) {
        throw new Error('Error fetching additional user info');
    }
}
