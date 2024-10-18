import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

var serviceAccount = require("../src/serviceAccountKey.json")

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ''
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = admin.firestore();

export { app, auth, db };
