import { Router } from 'express';

import authRoutes from './auth/auth.routes';
import mappingHistory from './mapping-history/mapping-history.routes';
import poeRoutes from './poe/poe.routes';
import poeninjaRoutes from './poeninja/poeninja.routes';

/**
 * Express router to be mounted under `/api` path.
 */
const router = Router();

router.get('/heartbeat/', (req, res) => res.json('OK'));

router.use('/auth', authRoutes);
router.use('/mapping-history', mappingHistory);
router.use('/poe', poeRoutes);
router.use('/poe-ninja', poeninjaRoutes);

export default router;
