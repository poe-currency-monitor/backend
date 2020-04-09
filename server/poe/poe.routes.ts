import { Router } from 'express';
import { celebrate } from 'celebrate';

import { characters, stashTabs, stashItems } from './poe.validators';
import { load, getCharacters, getStashTabs, getStashItems } from './poe.controllers';

const router = Router();

router.param('accountName', load);

router.route('/:accountName/characters/').get(celebrate(characters), getCharacters);
router.route('/:accountName/stash-tabs/').get(celebrate(stashTabs), getStashTabs);
router.route('/:accountName/stash-items/').get(celebrate(stashItems), getStashItems);

export default router;
