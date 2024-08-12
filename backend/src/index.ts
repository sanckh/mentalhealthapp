import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import admin from 'firebase-admin';
import { app as firebaseApp } from './firebase_options';


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://mental-health-app-77517-default-rtdb.firebaseio.com'
});

const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Allow requests from all origins (or specify your frontend's URL)
app.use(cors());


app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
