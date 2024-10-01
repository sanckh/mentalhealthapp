import { Router } from 'express';
import { getHasSubmittedDailyCheckin, submitCheckIn } from '../controllers/checkinsController';

const router = Router();

router.post('/submit', submitCheckIn);

router.get('/hassubmitteddailycheckin/:userId', getHasSubmittedDailyCheckin);

export default router;
