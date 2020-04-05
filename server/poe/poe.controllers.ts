import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

import { User } from '@interfaces/express.interfaces';
import SQLite from '@config/sqlite';

export async function load(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { accountName } = req.params;
  const db = await new SQLite().open();

  const user = await db.get<User>(`SELECT * FROM users WHERE account_name='${accountName}';`);

  if (!user) {
    res.status(404).json({ error: "Account name doesn't exist" });
  } else {
    res.locals.user = user;

    next();
  }
}

export async function getCharacter(req: Request, res: Response): Promise<void> {
  const user = res.locals.user as User;

  return fetch('https://pathofexile.com/character-window/get-characters', {
    method: 'get',
    redirect: 'follow',
    headers: {
      Cookie: `POESESSID=${user.poesessid}`,
    },
  })
    .then((response) => response.json().then((json) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({ error: `Unable to retrieve characters for account name ${user.account_name}` });
      } else {
        res.status(200).json({
          accountName: user.account_name,
          characters: json,
        });
      }
    });
}

export async function getStashTabs(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const user = res.locals.user as User;

  return fetch(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${user.account_name}&realm=${realm}&league=${league}&tabs=1&public=false`,
    {
      method: 'get',
      headers: {
        Cookie: `POESESSID=${user.poesessid}`,
      },
    },
  )
    .then((response) => response.json().then((json) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res
          .status(500)
          .json({ error: `Unable to retrieve stash-tabs for account name ${user.account_name} on league ${league}` });
      } else {
        res.status(200).json({
          accountName: user.account_name,
          tabs: json,
        });
      }
    });
}

export async function getStashItems(req: Request, res: Response): Promise<void> {
  const league = req.query.league as string;
  const realm = req.query.realm as string;
  const tabIndex = req.query.tabIndex as string;
  const user = res.locals.user as User;

  return fetch(
    `https://www.pathofexile.com/character-window/get-stash-items?accountName=${user.account_name}&realm=${realm}&league=${league}&tabs=0&tabIndex=${tabIndex}public=false`,
    {
      method: 'get',
      headers: {
        Cookie: `POESESSID=${user.poesessid}`,
      },
    },
  )
    .then((response) => response.json().then((json) => ({ response, json })))
    .then(({ response, json }) => {
      if (!response.ok) {
        res.status(500).json({
          error: `Unable to retrieve stash-tab items for account name ${user.account_name} on league ${league}`,
        });
      } else {
        res.status(200).json({
          accountName: user.account_name,
          items: json,
        });
      }
    });
}
