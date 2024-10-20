import { Router } from 'express';
import { getCrisisDocuments } from '../controllers/crisisController';

const router = Router();

router.get('/crisisdocuments', getCrisisDocuments);

export default router;
