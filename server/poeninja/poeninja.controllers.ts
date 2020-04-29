/* eslint import/prefer-default-export: "off" */
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import { Currency, Item } from '@interfaces/poeninja.interfaces';

/**
 * Fetch currency-rates from a `/currencyoverview` poe.ninja endpoint, this
 * includes currency and fragments.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getCurrencyRates(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

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
        res.status(200).json({ ...json });
      }
    });
}

/**
 * Fetch currency-rates from a `/itemoverview` poe.ninja endpoint.
 *
 * @param req Express request.
 * @param res Express response.
 */
export async function getItemRates(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const language = req.query.language as string;
  const type = req.query.type as string;

  return fetch(`https://poe.ninja/api/data/currencyoverview?league=${league}&type=${type}&language=${language}`, {
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
        res.status(200).json({ ...json });
      }
    });
}
