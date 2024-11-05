import { Router } from 'express';
import { getConsecutiveCheckins, getHasSubmittedDailyCheckin, submitCheckIn } from '../controllers/checkinsController';

const router = Router();

router.post('/submit', submitCheckIn);

router.get('/hassubmitteddailycheckin/:userId', getHasSubmittedDailyCheckin);

router.get('/consecutive/:userId', getConsecutiveCheckins);

export default router;
