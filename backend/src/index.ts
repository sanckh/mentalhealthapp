import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth_routes';
import checkinRoutes from './routes/checkin_routes';
import insightRoutes from './routes/insight_routes';
import crisisRoutes from './routes/crisis_routes';
import admin from 'firebase-admin';
import cors, { CorsOptions } from 'cors';
import userContactRoutes from './routes/userContacts_routes';
import logRoutes from './routes/log_routes';
import { requestLogger } from './utilities/logUtils';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const app = express();
const firebase = require('./firebase_options');
const port = process.env.PORT || 3000;

const logRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,             // Max 100 requests per minute
  message: 'Too many log requests. Please try again later.',
});

const allowedOrigins = [
  'http://localhost:3000', 
  '10.0.2.2:3000',
  'https://mentalhealthapp-id5p.onrender.com',
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));

app.options('*', (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204); // No content for preflight
});

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
