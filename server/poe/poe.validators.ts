import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export const characters = {
  [Segments.QUERY]: joi.object().keys({
    poesessid: joi.string().required(),
  }),
};

export const stashTabs = {
  [Segments.QUERY]: joi.object().keys({
    poesessid: joi.string().required(),
    league: joi.string().required(),
    realm: joi.string().required(),
  }),
};

export const stashItems = {
  [Segments.QUERY]: joi.object().keys({
    poesessid: joi.string().required(),
    league: joi.string().required(),
    realm: joi.string().required(),
    tabIndex: joi.string().required(),
  }),
};
