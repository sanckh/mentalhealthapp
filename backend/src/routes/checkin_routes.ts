import { Router } from 'express';
import { getConsecutiveCheckins, getHasSubmittedDailyCheckin, getRecentCheckinData, submitCheckIn } from '../controllers/checkinsController';

const router = Router();

router.post('/submit', submitCheckIn);

router.get('/hassubmitteddailycheckin/:userId', getHasSubmittedDailyCheckin);

router.get('/consecutive/:userId', getConsecutiveCheckins);

router.get('/getrecentcheckins/:userId', getRecentCheckinData);

export default router;
