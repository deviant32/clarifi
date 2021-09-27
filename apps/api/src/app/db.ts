import { PrismaClient } from '@prisma/client';
import SecretsManager from 'aws-sdk/clients/secretsmanager';

const sm = new SecretsManager();


export const getDB = async () => {
  let db: PrismaClient = undefined;


  if (db) return db;

  const dbURL = await sm.getSecretValue({
    SecretId: process.env.DB_SECRET || '',
  })
    .promise();

  const secretString = JSON.parse(dbURL.SecretString || '{}');
  const url = `mysql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.db}?connection_limit=1`;

  db = new PrismaClient({ datasources: { db: { url } } });
  return db;
};
