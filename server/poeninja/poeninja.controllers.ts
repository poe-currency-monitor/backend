/* eslint import/prefer-default-export: "off" */
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import { POENinjaCurrencyOverviewResponse } from '@interfaces/poeninja.interfaces';

export async function getCurrencyRates(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const language = req.query.language as string;

  return fetch(`https://poe.ninja/api/data/currencyoverview?league=${league}&type=Currency&language=${language}`, {
    method: 'get',
  })
    .then((response) => response.json().then((json: POENinjaCurrencyOverviewResponse) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({ error: `Unable to retrieve currency rates from poe.ninja ` });
      } else {
        res.status(200).json({ ...json });
      }
    });
}
