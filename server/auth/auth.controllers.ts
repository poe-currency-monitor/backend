import { Request, Response } from 'express';
import { v1 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import env from '@config/env';

const jwtSignOptions: jwt.SignOptions = {
  expiresIn: '7d',
};

/**
 * Generate a JWT for third-party tools using the same JWT secret.
 *
 * @param req Express request
 * @param res Express response
 */
export default (req: Request, res: Response): Promise<Response<unknown>> => {
  const poesessid = req.body.poesessid as string;

  return fetch('https://www.pathofexile.com/my-account', {
    method: 'get',
    redirect: 'follow',
    headers: {
      Cookie: `POESESSID=${poesessid}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      }

      throw new Error(`Unexpected response status from Path of Exile website: ${response.status} status-code`);
    })
    .then((html) => {
      const accountNameMatches = /\/account\/view-profile\/(.*?)"/.exec(html);

      if (accountNameMatches && accountNameMatches[1]) {
        const accountName = accountNameMatches[1];
        const token = jwt.sign({ id: uuid() }, env.secrets.jwt, jwtSignOptions);

        return res.json({ token, accountName });
      }

      return res.status(400).json({ error: 'Invalid POESESSID' });
    })
    .catch((err) => res.status(503).json({ error: err.message }));
};
