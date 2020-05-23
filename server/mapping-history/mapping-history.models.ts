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
        _id: false,
        id: Schema.Types.String,
        tabId: Schema.Types.String,
        date: Schema.Types.String,
        items: [
          {
            _id: false,
            item: Schema.Types.Mixed,
            income: {
              chaos: Schema.Types.Number,
              exalt: Schema.Types.Number,
              unit: Schema.Types.Number,
            },
          },
        ],
        income: {
          chaos: Schema.Types.Number,
          exalt: Schema.Types.Number,
          unit: Schema.Types.Number,
        },
      },
    ],
  },
  {
    versionKey: false,
  },
);

export const MappingHistoryModel = model<MappingHistoryDocument>('MappingHistory', MappingHistorySchema);
