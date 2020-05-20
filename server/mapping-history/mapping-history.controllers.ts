import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

import { MappingHistoryPayload } from '@interfaces/mapping-history.interfaces';
import { MappingHistoryModel } from './mapping-history.models';

/**
 * Verify that the POESESSID correspond to the expected account-name by logging
 * into the Path of Exile account using the POESESSID.
 *
 * Extract the account-name from the HTML page using regex and validate if the
 * account-name on the HTML page is the same as expected.
 *
 * @param poesessid POESESSID cookie value.
 * @param expectedAccountName Expected account-name for the specified POESESSID.
 */
function authPOESESSID(poesessid: string, expectedAccountName: string): Promise<boolean> {
  return fetch('https://www.pathofexile.com/my-account', {
    method: 'get',
    redirect: 'follow',
    headers: {
      Cookie: `POESESSID=${poesessid}`,
    },
  })
    .then((response) => response.text())
    .then((html) => {
      const accountNameMatches = html.match(/\/account\/view-profile\/(.*?)"/);

      if (accountNameMatches && accountNameMatches[1]) {
        const accountName = accountNameMatches[1];

        return accountName === expectedAccountName;
      }

      return false;
    });
}

/**
 * Create a new mapping-history for the specified account-name.
 *
 * Make sure there are no PoE account-name identity theft by verifying the
 * account-name of the POESESSID.
 *
 * @param req Express request
 * @param res Express response
 */
export async function create(req: Request, res: Response): Promise<void> {
  const { poesessid, accountname, character, league, created, history } = req.body as MappingHistoryPayload;

  const isAuthorized = await authPOESESSID(poesessid, accountname);

  if (!isAuthorized) {
    res.sendStatus(401);

    return;
  }

  try {
    const id = uuidv4();

    const documentPayload = {
      id,
      accountname,
      character,
      league,
      created,
      history,
    };

    const mappingHistoryDocument = await MappingHistoryModel.findOneAndUpdate(
      { created },
      { ...documentPayload },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();

    if (mappingHistoryDocument) {
      res.status(200).json(mappingHistoryDocument.toJSON());
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.sendStatus(500);
  }
}

/**
 * Get a single mapping-history by its id.
 *
 * @param req Express request
 * @param res Express response
 */
export async function get(req: Request, res: Response): Promise<void> {
  const id = req.query.id as string;

  try {
    const mappingHistoryDocument = await MappingHistoryModel.findOne({ id }).exec();

    if (mappingHistoryDocument) {
      res.status(200).json(mappingHistoryDocument.toJSON());
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
}

/**
 * Get all exported mapping-histories for a specific account-name.
 *
 * Make sure there are no PoE account-name identity theft by verifying the
 * account-name of the POESESSID.
 *
 * @param req Express request
 * @param res Express response
 */
export async function getAllPerAccountName(req: Request, res: Response): Promise<void> {
  const accountname = req.query.accountName as string;
  const poesessid = req.query.poesessid as string;

  const isAuthorized = await authPOESESSID(poesessid, accountname);

  if (!isAuthorized) {
    res.sendStatus(401);

    return;
  }

  try {
    const mappingHistoriesDocuments = await MappingHistoryModel.find({ accountname })
      .lean()
      .exec();

    if (mappingHistoriesDocuments.length > 0) {
      res.status(200).json(JSON.stringify(mappingHistoriesDocuments));
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
}
