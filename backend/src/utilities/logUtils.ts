import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logToFirestore } from '../services/logs_service';

export const generateCorrelationId = (): string => uuidv4();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['correlation-id'] as string || generateCorrelationId();
  req.headers['correlation-id'] = correlationId;

  const startTime = Date.now();

  // Log the incoming request asynchronously
  logToFirestore({
    eventType: 'INCOMING_REQUEST',
    message: 'Received request',
    data: {
      endpoint: req.originalUrl,
      method: req.method,
      correlationId,
    },
    timestamp: new Date().toISOString(),
    correlationId,
  }).catch((error) => console.error('Failed to log incoming request:', error));

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log the outgoing response asynchronously
    logToFirestore({
      eventType: 'RESPONSE',
      message: 'Sent response',
      data: {
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        duration,
      },
      correlationId,
      timestamp: new Date().toISOString(),
    }).catch((error) => console.error('Failed to log outgoing response:', error));
  });

  next();
};
