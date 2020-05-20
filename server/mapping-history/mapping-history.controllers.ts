import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { MappingHistoryPayload } from '@interfaces/mapping-history.interfaces';
import { MappingHistoryModel } from './mapping-history.models';

export async function create(req: Request, res: Response): Promise<void> {
  const { accountname, character, league, created, history } = req.body as MappingHistoryPayload;

  try {
    const id = `${accountname}-${character}_${uuidv4()}`;

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
