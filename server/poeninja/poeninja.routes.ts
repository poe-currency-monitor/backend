import { Router } from 'express';
import { celebrate } from 'celebrate';

import { currencyRates } from './poeninja.validators';
import { getCurrencyRates } from './poeninja.controllers';

const router = Router();

router.route('/currency-rates/').get(celebrate(currencyRates), getCurrencyRates);

export default router;
