/* eslint import/prefer-default-export: "off" */
import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export const currencyRates = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    language: joi.string().required(),
  }),
};
