/* eslint import/prefer-default-export: "off" */
import { Request, Response } from 'express';
import Cache from 'node-cache';
import fetch from 'node-fetch';

import { Currency, Item } from '@interfaces/poeninja.interfaces';

const CACHE_TTL = 60 * 60 * 12;

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
 * Fetch currency-rates from the `/currencyoverview` poe.ninja endpoint, this
 * includes currency and fragments.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getCurrencyRates(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  const cacheName = getCacheName(type, league);

  if (cache.has(cacheName)) {
    const json = cache.get<Currency.Response>(cacheName);

    res.status(200).json({ ...json });

    return Promise.resolve();
  }

  return fetch(`https://poe.ninja/api/data/currencyoverview?league=${league}&type=${type}&language=${language}`, {
    method: 'get',
  })
    .then((response) => response.json().then((json: Currency.Response) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({
          type,
          language,
          league,
          error: `Unable to retrieve currency-rates from poe.ninja`,
        });
      } else {
        cache.set<Currency.Response>(cacheName, json, CACHE_TTL);

        res.status(200).json({ ...json });
      }
    });
}

/**
 * Fetch item-rates from the `/itemoverview` poe.ninja endpoint, this endpoint
 * includes maps, scarabs, prophecies, unique items, ...
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getItemRates(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  const cacheName = getCacheName(type, league);

  if (cache.has(cacheName)) {
    const json = cache.get<Item.Response>(cacheName);

    res.status(200).json({ ...json });

    return Promise.resolve();
  }

  return fetch(`https://poe.ninja/api/data/itemoverview?league=${league}&type=${type}&language=${language}`, {
    method: 'get',
  })
    .then((response) => response.json().then((json: Item.Response) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({
          type,
          language,
          league,
          error: `Unable to retrieve item-rates from poe.ninja`,
        });
      } else {
        cache.set<Item.Response>(cacheName, json, CACHE_TTL);

        res.status(200).json({ ...json });
      }
    });
}
