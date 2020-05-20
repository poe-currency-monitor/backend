import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createHistory, getHistory } from './mapping-history.validators';
import { create, get } from './mapping-history.controllers';

const router = Router();

router.route('/export/').post(celebrate(createHistory), create);
router.route('/import/').get(celebrate(getHistory), get);

export default router;
