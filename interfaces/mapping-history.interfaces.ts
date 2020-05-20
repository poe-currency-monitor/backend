import { Document } from 'mongoose';

import { POEItemIncome, POEIncome } from '@interfaces/poe.interfaces';

export interface MappingHistoryGetQuery {
  id: string;
}

export interface MappingHistoryPayload {
  accountname: string;
  character: string;
  league: string;
  created: string;
  history: {
    id: string;
    income: POEIncome;
    items: POEItemIncome;
    tabId: string;
    date: string;
  }[];
}

export interface MappingHistoryDocument extends MappingHistoryPayload, Document {
  id: string;
}
