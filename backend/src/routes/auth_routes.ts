import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase_options';
import {login, register, signout, getUserInfo} from '../controllers/authsController';

const router = express.Router();
const auth = getAuth(app);


router.post('/register', register);

router.post('/login', login);

router.get('/user', getUserInfo);

router.post('/signout', signout);

export default router;
