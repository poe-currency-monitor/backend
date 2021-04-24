/* eslint import/prefer-default-export: "off" */
import { Segments } from 'celebrate';
import joi from 'joi';

export const allCategoriesQueryParameters = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    language: joi.string().required(),
  }),
};

export const currencyQueryParameters = {
  [Segments.QUERY]: joi.object().keys({
    league: joi.string().required(),
    language: joi.string().required(),
    type: joi.string().required().valid('Currency', 'Fragment'),
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
        'DivinationCard',
        'Prophecy',
        'Oil',
        'Incubator',
        'UniqueWeapon',
        'UniqueArmour',
        'UniqueAccessory',
        'UniqueFlask',
        'UniqueJewel',
        'SkillGem',
        'Map',
        'BlightedMap',
        'UniqueMap',
        'DeliriumOrb',
        'Invitation',
        'Scarab',
        'Watchstone',
        'BaseType',
        'Fossil',
        'Resonator',
        'HelmetEnchant',
        'Beast',
        'Essence',
        'Vial',
      ),
  }),
};
