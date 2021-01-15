import { Request, Response } from 'express';
import Cache from 'node-cache';
import fetch from 'node-fetch';

import { Currency, Item } from '@interfaces/poeninja.interfaces';

const CACHE_TTL = 60 * 60 * 12;
const CURRENCY_CATEGORIES = ['Currency', 'Fragment'];

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
function generateFetchPromise<T>(category: string, league: string, language: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    fetch(`https://poe.ninja/api/data/currencyoverview?league=${league}&type=${category}&language=${language}`, {
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
          reject(new Error(`Unexpected null value while fetching ${category} poe.ninja rates`));
        }

        resolve(json);

        return json;
      })
      .catch((err) => reject(err));
  });
}

/**
 * Fetch all currency-rates types from the `/currencyoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getAllCurrencyRates(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const language = req.query.language as string;

  const hasCachedCategories = CURRENCY_CATEGORIES.every((category) => cache.has(getCacheName(category, league)));

  if (hasCachedCategories) {
    const cachedCategories = CURRENCY_CATEGORIES.map((category) => ({
      type: category,
      response: cache.get(getCacheName(category, league)) as Currency.Response,
    }));

    return res.status(200).json({ categories: cachedCategories });
  }

  try {
    const promises = CURRENCY_CATEGORIES.map((category) =>
      generateFetchPromise<Currency.Response>(category, league, language),
    );

    const currencyResponses = await Promise.all(promises);
    const json = currencyResponses.map((currencyResponse, i) => ({
      type: CURRENCY_CATEGORIES[i],
      response: currencyResponse,
    }));

    currencyResponses.forEach((currencyResponse, i) =>
      cache.set(getCacheName(CURRENCY_CATEGORIES[i], league), currencyResponse, CACHE_TTL),
    );

    return res.status(200).json({ ...json });
  } catch (error) {
    return res.status(500).json(`Unable to fetch poe.ninja currency-rates`);
  }
}

/**
 * Fetch currency-rates from the `/currencyoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getCurrencyRates(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  const cacheName = getCacheName(type, league);

  if (cache.has(cacheName)) {
    const json = cache.get<Currency.Response>(cacheName);

    return res.status(200).json({ ...json });
  }

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

        cache.set<Currency.Response>(cacheName, json, CACHE_TTL);

        return res.status(200).json({ ...json });
      })
  );
}

/**
 * Fetch item-rates from the `/itemoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getItemRates(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  const cacheName = getCacheName(type, league);

  if (cache.has(cacheName)) {
    const json = cache.get<Item.Response>(cacheName);

    return res.status(200).json({ ...json });
  }

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

        cache.set<Item.Response>(cacheName, json, CACHE_TTL);

        return res.status(200).json({ ...json });
      })
  );
}
