import { Segments } from 'celebrate';
import joi from '@hapi/joi';

const historyItemSchema = joi.object().keys({
  income: joi.object().keys({
    chaos: joi.number().positive(),
    exalt: joi.number().positive(),
    unit: joi.number().positive(),
  }),

  // PoE item
  item: joi.object().unknown(),
});

const historySchema = joi.object().keys({
  id: joi.string(),
  tabId: joi.string(),
  date: joi.string().isoDate(),

  income: joi.object().keys({
    chaos: joi.number().positive(),
    exalt: joi.number().positive(),
    unit: joi.number().valid(0),
  }),

  items: joi
    .array()
    .items(historyItemSchema)
    .min(1)
    .max(500),
});

export const createHistory = {
  [Segments.BODY]: joi.object().keys({
    accountname: joi.string(),
    character: joi.string(),
    league: joi.string(),
    created: joi.string().isoDate(),

    history: joi
      .array()
      .items(historySchema)
      .min(0)
      .max(100),
  }),
};

export const getHistory = {
  [Segments.QUERY]: joi.object().keys({
    id: joi.string(),
  }),
};
