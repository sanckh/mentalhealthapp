import express from 'express';
import admin from './firebaseAdmin';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).send({ uid: userRecord.uid });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

// Login user and return custom token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Verify user with Firebase Admin
      const userRecord = await admin.auth().getUserByEmail(email);
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      res.status(200).send({ customToken });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });

export default router;
