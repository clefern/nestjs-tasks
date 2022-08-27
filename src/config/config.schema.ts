import * as Joi from '@hapi/joi';

// we need to export a joi object
export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  TYPEORM_CONNECTION: Joi.string().required(),
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_PORT: Joi.number().default(5432),
  JWT_SECRET: Joi.string().required(),
});
