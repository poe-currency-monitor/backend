import { Router } from 'express';
import { celebrate } from 'celebrate';

import { allCategoriesQueryParameters, currencyQueryParameters, itemQueryParameters } from './poeninja.validators';
import { getAllCurrencyRates, getAllItemRates, getCurrencyRates, getItemRates } from './poeninja.controllers';

const router = Router();

router.route('/all-currency-rates/').get(celebrate(allCategoriesQueryParameters), getAllCurrencyRates);
router.route('/all-item-rates/').get(celebrate(allCategoriesQueryParameters), getAllItemRates);
router.route('/currency-rates/').get(celebrate(currencyQueryParameters), getCurrencyRates);
router.route('/item-rates/').get(celebrate(itemQueryParameters), getItemRates);

export default router;
