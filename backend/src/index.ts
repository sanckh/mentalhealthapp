import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import checkinRoutes from './routes/checkin_routes';
import insightRoutes from './routes/insight_routes';
import crisisRoutes from './routes/crisis_routes';
import admin from 'firebase-admin';
import cors from 'cors';
import userContactRoutes from './routes/userContacts_routes';

const app = express();
const firebase = require('./firebase_options');
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
app.use('/checkin', checkinRoutes); 
app.use('/insight', insightRoutes);
app.use('/crisis', crisisRoutes);
app.use('/contacts', userContactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
