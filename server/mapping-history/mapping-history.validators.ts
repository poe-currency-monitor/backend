import { Segments } from 'celebrate';
import joi from '@hapi/joi';

const historyItemSchema = joi
  .object()
  .keys({
    income: joi.object().keys({
      chaos: joi
        .number()
        .positive()
        .allow(0)
        .required(),
      exalt: joi
        .number()
        .positive()
        .allow(0)
        .required(),
      unit: joi
        .number()
        .positive()
        .allow(0)
        .required(),
    }),

    // PoE item
    item: joi
      .object()
      .required()
      .unknown(),
  })
  .required();

const historySchema = joi.object().keys({
  id: joi.string().required(),
  tabId: joi.string().required(),
  date: joi
    .string()
    .isoDate()
    .required(),

  income: joi
    .object()
    .keys({
      chaos: joi
        .number()
        .positive()
        .allow(0)
        .required(),
      exalt: joi
        .number()
        .positive()
        .allow(0)
        .required(),
      unit: joi
        .number()
        .valid(0)
        .required(),
    })
    .required(),

  items: joi
    .array()
    .items(historyItemSchema)
    .min(1)
    .max(500)
    .required(),
});

export const createHistory = {
  [Segments.BODY]: joi.object().keys({
    accountname: joi.string().required(),
    character: joi.string().required(),
    league: joi.string().required(),
    created: joi
      .string()
      .isoDate()
      .required(),

    history: joi
      .array()
      .items(historySchema)
      .min(0)
      .max(100)
      .required(),
  }),
};

export const getHistory = {
  [Segments.QUERY]: joi.object().keys({
    id: joi.string().required(),
  }),
};

export const getAllHistoriesPerAccountName = {
  [Segments.QUERY]: joi.object().keys({
    accountName: joi.string().required(),
  }),
};
