import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

import { User } from '@interfaces/express.interfaces';
import { POEItem } from '@interfaces/poe.interfaces';

export async function load(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { accountName } = req.params;
  const { poesessid } = req.query;

  res.locals.user = { accountName, poesessid } as User;

  next();
}

export async function getCharacters(req: Request, res: Response): Promise<void> {
  const { accountName, poesessid } = res.locals.user as User;

  return fetch('https://pathofexile.com/character-window/get-characters', {
    method: 'get',
    redirect: 'follow',
    headers: {
      Cookie: `POESESSID=${poesessid}`,
    },
  })
    .then((response) => response.json().then((json) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({ error: `Unable to retrieve characters for account name ${accountName}` });
      } else {
        res.status(200).json({
          accountName,
          characters: json,
        });
      }
    });
}

export async function getStashTabs(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const { accountName, poesessid } = res.locals.user as User;

  return fetch(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&realm=${realm}&league=${league}&tabs=1&public=false`,
    {
      method: 'get',
      headers: {
        Cookie: `POESESSID=${poesessid}`,
      },
    },
  )
    .then((response) => response.json().then((json) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res
          .status(500)
          .json({ error: `Unable to retrieve stash-tabs for account name ${accountName} on league ${league}` });
      } else {
        res.status(200).json({
          accountName,
          tabs: json,
        });
      }
    });
}

export async function getStashItems(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const tabIndex = req.query.tabIndex as string;
  const { accountName, poesessid } = res.locals.user as User;

  const tabIndexes = tabIndex.split(',');

  const items: { [key: string]: POEItem[] } = {};

  const stashItemsPromises = tabIndexes.map(
    (i) =>
      new Promise((resolve, reject) =>
        fetch(
          `https://www.pathofexile.com/character-window/get-stash-items?accountName=${accountName}&realm=${realm}&league=${league}&tabs=0&tabIndex=${i}&public=false`,
          {
            method: 'get',
            headers: {
              Cookie: `POESESSID=${poesessid}`,
            },
          },
        )
          .then((response) => response.json().then((json) => ({ response, json })))
          .then(({ response, json }) => {
            if (!response.ok) {
              reject(new Error(`Unable to retrieve stash-tab items`));
            } else {
              items[i] = json.items;
              resolve(json);
            }
          }),
      ),
  );

  return Promise.all([...stashItemsPromises])
    .then(() => {
      res.status(200).json({ accountName, items });
    })
    .catch(() => {
      res.status(500).json({ error: 'Unable to fetch stash-tabs items' });
    });
}
