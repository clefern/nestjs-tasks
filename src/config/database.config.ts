// src/config/database.config.ts

import * as path from 'path';
import * as dotenv from 'dotenv';
import { dotEnvOptions } from '../config/dotenv-options';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
const result = dotenv.config(dotEnvOptions);
const baseDir = path.join(__dirname, '../');
const entitiesPath = `${baseDir}db/entities/*.entity.{ts,js}`;
const migrationPath = `${baseDir}db/migrations/*{.ts,.js}`;

// Make sure dbConfig is imported only after dotenv.config

if (result.error) {
  console.log(result.error);
}
// import * as dbConfig from '../config/database.config';

// module.exports = dbConfig.default;
const isProduction = process.env.NODE_ENV === 'production';
const logger = new Logger();
logger.log(`${process.env.NODE_ENV} -> ${isProduction}`);

const configuration: TypeOrmModuleOptions = {
  ssl: isProduction,
  extra: {
    ssl: isProduction ? { rejectUnauthorized: false } : null,
  },
  type: process.env.TYPEORM_CONNECTION as any,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process.env.TYPEORM_PORT, 10),
  synchronize: true,
  autoLoadEntities: true,
  entities: [entitiesPath],
  migrations: [migrationPath],
  // migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
  // seeds: [`src/db/seeds/*.seed.ts`],
  cli: {
    migrationsDir: migrationPath,
    entitiesDir: entitiesPath,
  },
};
export default configuration;
