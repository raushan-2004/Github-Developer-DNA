import { Router } from 'express';
import { getUser, getRepos, getStats } from '../controllers/githubController';

const router = Router();

router.get('/user/:username', getUser);
router.get('/repos/:username', getRepos);
router.get('/stats/:username', getStats);

export default router;
