import { Router } from 'express';
import { celebrate } from 'celebrate';

import { allCurrencyQueryParameters, currencyQueryParameters, itemQueryParameters } from './poeninja.validators';
import { getAllCurrencyRates, getCurrencyRates, getItemRates } from './poeninja.controllers';

const router = Router();

router.route('/currency-rates/').get(celebrate(currencyQueryParameters), getCurrencyRates);
router.route('/all-currency-rates/').get(celebrate(allCurrencyQueryParameters), getAllCurrencyRates);
router.route('/item-rates/').get(celebrate(itemQueryParameters), getItemRates);

export default router;
