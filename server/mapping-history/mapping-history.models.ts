import { Schema, model } from 'mongoose';

import { MappingHistoryDocument } from '@interfaces/mapping-history.interfaces';

export const MappingHistorySchema = new Schema({
  accountname: Schema.Types.String,

  date: {
    type: Schema.Types.Date,
    default: Date.now,
  },

  history: [
    {
      id: Schema.Types.String,
      tabId: Schema.Types.String,
      date: Schema.Types.Date,
      income: [Schema.Types.Mixed],
      items: [Schema.Types.Mixed],
    },
  ],
});

export const MappingHistoryModel = model<MappingHistoryDocument>('MappingHistory', MappingHistorySchema);
