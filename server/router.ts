import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import poeRoutes from './poe/poe.routes';

/**
 * Express router to be mounted under `/api` path.
 */
const router = Router();

router.get('/heartbeat/', (req, res) => res.json('OK'));

router.use('/auth', authRoutes);
router.use('/poe', poeRoutes);

export default router;
