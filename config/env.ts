import joi from '@hapi/joi';

/**
 * Joi schema to validate environment variables to ensure we don't have
 * undefined variables.
 */
const envSchema = joi
  .object({
    NODE_ENV: joi.string().default('development'),

    JWT_SECRET: joi.string(),

    API_PORT: joi.number().port(),
    API_HTTPS_PORT: joi.number().port(),

    MONGO_URI: joi.string().uri(),

    PRIVATE_KEY_PATH: joi.string(),
    CERTIFICATE_PATH: joi.string(),
    CHAIN_PATH: joi.string(),
  })
  .unknown();

const { error, value } = envSchema.validate(process.env);

if (error && process.env.NODE_ENV !== 'test') {
  throw new Error(`Config validation errors, please check the .env file: ${error.message}`);
}

export default {
  nodeEnv: value.NODE_ENV as string,
  port: value.API_PORT as number,
  httpsPort: value.API_HTTPS_PORT as number,

  https: {
    privateKey: value.PRIVATE_KEY_PATH as string,
    certificate: value.CERTIFICATE_PATH as string,
    chain: value.CHAIN_PATH as string,
  },

  secrets: {
    jwt: value.JWT_SECRET as string,
  },

  mongo: {
    uri: value.MONGO_URI as string,
  },
};
