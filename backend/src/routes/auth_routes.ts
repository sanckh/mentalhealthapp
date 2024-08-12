import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase_options';


const router = express.Router();
const auth = getAuth(app);

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.status(201).send({ uid: userCredential.user.uid });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// Login user and return custom token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Verify user with Firebase Admin
      const userRecord = await signInWithEmailAndPassword(auth, email, password);
      res.status(200).send({ uid: userRecord.user.uid });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });

export default router;
