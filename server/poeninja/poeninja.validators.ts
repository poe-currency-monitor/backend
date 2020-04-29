/* eslint import/prefer-default-export: "off" */
import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export const currencyQueryParameters = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    language: joi.string().required(),
    type: joi
      .string()
      .required()
      .valid('Currency', 'Fragment'),
  }),
};

export const itemQueryParameters = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    language: joi.string().required(),
    type: joi
      .string()
      .required()
      .valid(
        'DeliriumOrb',
        'Watchstone',
        'Oil',
        'Incubator',
        'Scarab',
        'Fossil',
        'Resonator',
        'Essence',
        'DivinationCard',
        'Prophecy',
        'SkillGem',
        'UniqueMap',
        'Maps',
        'UniqueJewel',
        'UniqueFlask',
        'Beast',
        'Vial',
      ),
  }),
};
