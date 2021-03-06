import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

import { User } from '@interfaces/express.interfaces';
import { POEItem, POEStashTabItemsWithTabsResponse, POEStashTabItemsResponse } from '@interfaces/poe.interfaces';

export function load(req: Request, res: Response, next: NextFunction): void {
  const { accountName } = req.params;
  const { poesessid } = req.query;

  res.locals.user = { accountName, poesessid } as User;

  next();
}

export async function getCharacters(req: Request, res: Response): Promise<Response<unknown>> {
  const { accountName, poesessid } = res.locals.user as User;

  return (
    fetch('https://pathofexile.com/character-window/get-characters', {
      method: 'get',
      redirect: 'follow',
      headers: {
        'Cookie': `POESESSID=${poesessid}`,
        'User-Agent': `PoECurrencyMonitor/0.1.0`,
      },
    })
      // eslint-disable-next-line promise/no-nesting
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (!response.ok) {
          return res.status(500).json({ error: `Unable to retrieve characters for account name ${accountName}` });
        }

        return res.status(200).json({
          accountName,
          characters: json,
        });
      })
  );
}

export async function getStashTabs(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const { accountName, poesessid } = res.locals.user as User;

  return (
    fetch(
      `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&realm=${realm}&league=${league}&tabs=1&public=false`,
      {
        method: 'get',
        headers: {
          'Cookie': `POESESSID=${poesessid}`,
          'User-Agent': `PoECurrencyMonitor/0.1.0`,
        },
      },
    )
      // eslint-disable-next-line promise/no-nesting
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (!response.ok) {
          return res
            .status(500)
            .json({ error: `Unable to retrieve stash-tabs for account name ${accountName} on league ${league}` });
        }

        return res.status(200).json({
          accountName,
          tabs: json,
        });
      })
  );
}

export async function getStashItems(req: Request, res: Response): Promise<Response<unknown>> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const tabIndex = req.query.tabIndex as string;
  const { accountName, poesessid } = res.locals.user as User;

  const tabIndexes = tabIndex.split(',').map((index) => parseInt(index, 10));

  let items: { [key: string]: { tabIndex: number; items: POEItem[] } } = {};

  const stashTabs = await fetch(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&realm=${realm}&league=${league}&tabs=1&tabIndex=&public=false`,
    {
      method: 'get',
      headers: {
        'Cookie': `POESESSID=${poesessid}`,
        'User-Agent': `PoECurrencyMonitor/0.1.0`,
      },
    },
  )
    .then((response) => response.json())
    .then((json: POEStashTabItemsWithTabsResponse) => json.tabs);

  /* eslint-disable @typescript-eslint/no-misused-promises */
  const stashItemsPromises = tabIndexes.map((index) => {
    return new Promise((resolve, reject) =>
      fetch(
        `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&realm=${realm}&league=${league}&tabs=0&tabIndex=${index}&public=false`,
        {
          method: 'get',
          headers: {
            'Cookie': `POESESSID=${poesessid}`,
            'User-Agent': `PoECurrencyMonitor/0.1.0`,
          },
        },
      )
        // eslint-disable-next-line promise/no-nesting
        .then((response) => response.json().then((json: POEStashTabItemsResponse) => ({ response, json })))
        .then(({ response, json }) => {
          if (!response.ok) {
            return reject(new Error(`Unable to retrieve stash-tab items`));
          }

          items = {
            ...items,
            [stashTabs[index].id]: {
              tabIndex: index,
              items: json.items,
            },
          };

          return resolve('ok');
        }),
    );
  });
  /* eslint-enable @typescript-eslint/no-misused-promises */

  return Promise.all([...stashItemsPromises])
    .then(() => res.status(200).json({ accountName, items }))
    .catch(() => res.status(500).json({ error: 'Unable to fetch stash-tabs items' }));
}
