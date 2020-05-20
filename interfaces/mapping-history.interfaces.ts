import { Document } from 'mongoose';

import { POEItemIncome, POEIncome } from '@interfaces/poe.interfaces';

export interface MappingHistoryPayload {
  poesessid: string;
  accountname: string;
  character: string;
  league: string;
  created: string;
  history: {
    id: string;
    income: POEIncome;
    items: POEItemIncome[];
    tabId: string;
    date: string;
  }[];
}

export interface MappingHistoryDocument extends Document {
  id: string;
  accountname: string;
  character: string;
  league: string;
  created: string;
  history: {
    id: string;
    income: POEIncome;
    items: POEItemIncome[];
    tabId: string;
    date: string;
  }[];
}
