import { Router } from 'express';
import { celebrate } from 'celebrate';

import { createHistory, getHistory, getAllHistoriesPerAccountName } from './mapping-history.validators';
import { create, get, getAllPerAccountName } from './mapping-history.controllers';

const router = Router();

router.route('/export/').post(celebrate(createHistory), create);
router.route('/get-all/').get(celebrate(getAllHistoriesPerAccountName), getAllPerAccountName);
router.route('/import/').get(celebrate(getHistory), get);

export default router;
