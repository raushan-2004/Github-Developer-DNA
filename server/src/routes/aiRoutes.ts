import { Router } from 'express';
import { getAiCareerReview } from '../controllers/aiController';

const router = Router();

router.post('/review', getAiCareerReview);

export default router;
