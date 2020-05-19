import { Document } from 'mongoose';

import { POEItemIncome, POEIncome } from '@interfaces/poe.interfaces';

export interface MappingHistoryDocument extends Document {
  accountname: string;
  date: Date;
  history: {
    id: string;
    income: POEIncome;
    items: POEItemIncome;
    tabId: string;
    date: Date;
  }[];
}
