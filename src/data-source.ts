import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as process from 'process';
import { SimpleTypeDatabase } from './common/types/swapi-types';

config();

export const AppDataSource: DataSource = new DataSource({
  type: process.env.DATABASE_TYPE as SimpleTypeDatabase,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: [],
});
