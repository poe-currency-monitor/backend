import { Schema, model } from 'mongoose';

import { MappingHistoryDocument } from '@interfaces/mapping-history.interfaces';

export const MappingHistorySchema = new Schema(
  {
    id: Schema.Types.String,
    accountname: Schema.Types.String,
    character: Schema.Types.String,
    league: Schema.Types.String,

    created: {
      type: Schema.Types.String,
      default: new Date().toISOString(),
    },

    history: [
      {
        id: Schema.Types.String,
        tabId: Schema.Types.String,
        date: Schema.Types.String,
        items: [Schema.Types.Mixed],
        income: {
          chaos: Schema.Types.Number,
          exalt: Schema.Types.Number,
          unit: Schema.Types.Number,
        },
      },
    ],
  },
  {
    _id: false,
    id: false,
    versionKey: false,
  },
);

export const MappingHistoryModel = model<MappingHistoryDocument>('MappingHistory', MappingHistorySchema);
