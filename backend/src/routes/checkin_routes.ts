import { Router } from 'express';
import { submitCheckIn } from '../controllers/checkinsController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.post('/submit', authenticateUser, submitCheckIn);

export default router;
