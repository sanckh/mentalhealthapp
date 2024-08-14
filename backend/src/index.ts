import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import checkinRoutes from './routes/checkin_routes';
import admin from 'firebase-admin';
import cors from 'cors';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://mental-health-app-77517-default-rtdb.firebaseio.com'
});

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration to allow requests from the frontend
const corsOptions = {
  origin: true,
  credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/api', checkinRoutes); 

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
