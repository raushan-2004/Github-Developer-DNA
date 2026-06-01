import { Router } from 'express';
import { getUser, getRepos, getStats, analyzeDeveloper } from '../controllers/githubController';

const router = Router();

router.get('/user/:username', getUser);
router.get('/repos/:username', getRepos);
router.get('/stats/:username', getStats);
router.get('/analyze/:username', analyzeDeveloper);

export default router;
