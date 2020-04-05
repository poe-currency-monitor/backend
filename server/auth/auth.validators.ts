import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export default {
  [Segments.BODY]: joi.object().keys({
    poesessid: joi.string().required(),
  }),
};
