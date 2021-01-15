import { Request, Response } from 'express';
import Cache from 'node-cache';
import fetch from 'node-fetch';

import { Currency, Item } from '@interfaces/poeninja.interfaces';

const CACHE_TTL = 60 * 60 * 12;
const CURRENCY_CATEGORIES = ['Currency', 'Fragment'];
const ITEM_CATEGORIES = [
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
  'Map',
  'UniqueJewel',
  'UniqueFlask',
  'Beast',
  'Vial',
];

const cache = new Cache();

/**
 * Return a cache name based on parameters.
 *
 * @param type poe.ninja resource type.
 * @param league poe.ninja league.
 */
function getCacheName(type: string, league: string): string {
  return `poe-ninja-${type}-${league}`.toLowerCase();
}

/**
 * Generate a fetch promise to retrieve rates for item/currency rates.
 *
 * @param category Currency or Item category.
 * @param league League reference.
 * @param language poe.ninja language.
 */
function generateFetchPromise<T>(
  endpoint: string,
  category: string,
  league: string,
  language: string,
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    fetch(`https://poe.ninja/api/data/${endpoint}?league=${league}&type=${category}&language=${language}`, {
      method: 'get',
    })
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`Unable to fetch ${category} poe.ninja rates.`));
          return null;
        }

        return response.json() as Promise<T>;
      })
      .then((json) => {
        if (!json) {
          reject(new Error(`Unexpected null value while fetching ${category} poe.ninja rates.`));
        }

        resolve(json);
        return json;
      })
      .catch((err) => reject(err));
  });
}

/**
 * Fetch all type-categories rates from poe.ninja. Cache automatically
 * poe.ninja responses.
 *
 * A type can be `CURRENCY` or `ITEM`:
 * - type is **CURRENCY**: Currency, Fragment, ...
 * - type is **ITEM**: Helmet, Axe, Ring, Map, ...
 *
 * @param req Express request.
 * @param res Express response.
 * @param categories poe.ninja type categories.
 * @param endpoint poe.ninja endpoint.
 */
export async function getAllTypeRates<T>(
  req: Request,
  res: Response,
  categories: string[],
  endpoint: string,
): Promise<Response<T>> {
  const league = req.query.league as string;
  const language = req.query.language as string;

  const hasCachedCategories = categories.every((category) => cache.has(getCacheName(category, league)));

  if (hasCachedCategories) {
    const cachedCategories = categories.map((category, i) => ({
      type: categories[i],
      response: cache.get(getCacheName(category, league)) as T,
    }));

    return res.status(200).json({ categories: cachedCategories });
  }

  try {
    const promises = categories.map((category) => generateFetchPromise<T>(endpoint, category, league, language));
    const poeninjaResponses = await Promise.all(promises);

    const json = poeninjaResponses.map((poeninjaResponse, i) => ({
      type: categories[i],
      response: poeninjaResponse,
    }));

    poeninjaResponses.forEach((poeninjaResponse, i) =>
      cache.set(getCacheName(categories[i], league), poeninjaResponse, CACHE_TTL),
    );

    return res.status(200).json({ categories: json });
  } catch (error) {
    return res.status(500).json(`Unable to fetch poe.ninja rates`);
  }
}

/**
 * Fetch all currency-rates types from poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 */
export function getAllCurrencyRates(req: Request, res: Response): Promise<Response<unknown>> {
  return getAllTypeRates(req, res, CURRENCY_CATEGORIES, 'currencyoverview');
}

/**
 * Fetch all item-rates types from poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.

 */
export function getAllItemRates(req: Request, res: Response): Promise<Response<unknown>> {
  return getAllTypeRates(req, res, ITEM_CATEGORIES, 'itemoverview');
}

/**
 * **DEPRECATED**: please use the `/all-currency-rates/` endpoint.
 *
 * Fetch currency-rates from the `/currencyoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 * @deprecated
 */
export async function getCurrencyRates(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  return (
    fetch(`https://poe.ninja/api/data/currencyoverview?league=${league}&type=${type}&language=${language}`, {
      method: 'get',
    })
      // eslint-disable-next-line promise/no-nesting
      .then((response) => response.json().then((json: Currency.Response) => ({ response, json })))
      .then(({ response, json }) => {
        if (!response.ok) {
          return res.status(500).json({
            type,
            language,
            league,
            error: `Unable to retrieve currency-rates from poe.ninja`,
          });
        }

        return res.status(200).json({ ...json });
      })
  );
}

/**
 * **DEPRECATED**: please use the `/all-item-rates/` endpoint.
 *
 * Fetch item-rates from the `/itemoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 * @deprecated
 */
export async function getItemRates(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  return (
    fetch(`https://poe.ninja/api/data/itemoverview?league=${league}&type=${type}&language=${language}`, {
      method: 'get',
    })
      // eslint-disable-next-line promise/no-nesting
      .then((response) => response.json().then((json: Item.Response) => ({ response, json })))
      .then(({ response, json }) => {
        if (!response.ok) {
          return res.status(500).json({
            type,
            language,
            league,
            error: `Unable to retrieve item-rates from poe.ninja`,
          });
        }

        return res.status(200).json({ ...json });
      })
  );
}
