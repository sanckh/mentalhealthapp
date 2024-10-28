import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import checkinRoutes from './routes/checkin_routes';
import insightRoutes from './routes/insight_routes';
import crisisRoutes from './routes/crisis_routes';
import admin from 'firebase-admin';
import userContactRoutes from './routes/userContacts_routes';
import logRoutes from './routes/log_routes';
import { requestLogger } from './utilities/logUtils';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const app = express();
const firebase = require('./firebase_options');
const port = process.env.PORT || 3000;
var cors = require('cors')

const logRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,             // Max 100 requests per minute
  message: 'Too many log requests. Please try again later.',
});

const corsOptions = {
  origin: '*', // Allow all origins (change to specific origins later)
  credentials: true, // Allow cookies and other credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204, 
};

app.use(cors(corsOptions))



// Handle preflight requests (OPTIONS method)
app.options('*', cors(corsOptions));

app.use(requestLogger);

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/checkin', checkinRoutes); 
app.use('/insight', insightRoutes);
app.use('/crisis', crisisRoutes);
app.use('/contacts', userContactRoutes);
app.use('/log', logRateLimiter, logRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
