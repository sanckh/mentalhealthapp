import rateLimit from 'express-rate-limit';
import express from 'express';

const app = express();

const logRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,              // Max 100 requests per minute
  message: 'Too many log requests. Please try again later.',
});

app.use('/log', logRateLimiter);
