import { Router } from 'express';
import { celebrate } from 'celebrate';

import { currencyQueryParameters, itemQueryParameters } from './poeninja.validators';
import { getCurrencyRates, getItemRates } from './poeninja.controllers';

const router = Router();

router.route('/currency-rates/').get(celebrate(currencyQueryParameters), getCurrencyRates);
router.route('/item-rates/').get(celebrate(itemQueryParameters), getItemRates);

export default router;
