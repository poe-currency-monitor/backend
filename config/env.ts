import joi, { ValidationResult } from 'joi';

interface EnvSchemaType {
  NODE_ENV: string;
  JWT_SECRET: string;
  API_PORT: string;
  API_HTTPS_PORT: string;
  MONGO_URI: string;
  PRIVATE_KEY_PATH: string;
  CERTIFICATE_PATH: string;
  CHAIN_PATH: string;
}

interface SchemaValidationResponse extends ValidationResult {
  value: EnvSchemaType;
}

/**
 * Joi schema to validate environment variables to ensure we don't have
 * undefined variables.
 */
const envSchema = joi
  .object<EnvSchemaType>({
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

const { error, value }: SchemaValidationResponse = envSchema.validate(process.env);

if (error && process.env.NODE_ENV !== 'test') {
  throw new Error(`Config validation errors, please check the .env file: ${error.message}`);
}

export default {
  nodeEnv: value.NODE_ENV,
  port: parseInt(value.API_PORT, 10),
  httpsPort: parseInt(value.API_HTTPS_PORT, 10),

  https: {
    privateKey: value.PRIVATE_KEY_PATH,
    certificate: value.CERTIFICATE_PATH,
    chain: value.CHAIN_PATH,
  },

  secrets: {
    jwt: value.JWT_SECRET,
  },

  mongo: {
    uri: value.MONGO_URI,
  },
};
