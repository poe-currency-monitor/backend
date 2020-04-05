import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export const stashTabs = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    realm: joi.string().required(),
  }),
};

export const stashItems = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    realm: joi.string().required(),
    tabIndex: joi.string().required(),
  }),
};
