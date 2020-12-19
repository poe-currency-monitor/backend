import { Segments } from 'celebrate';
import joi from 'joi';

export default {
  [Segments.BODY]: joi.object().keys({
    poesessid: joi.string().required(),
  }),
};
