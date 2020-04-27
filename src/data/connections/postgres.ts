import "reflect-metadata";
import * as path from 'path'
import { createConnection } from "typeorm";

export async function initializePostgres(): Promise<void> {
  console.log('Trying to initialize Postgres connection');
  // setup connection info
  const connectionUrl = process.env.PG_URL;
  const host = process.env.DB_HOST;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const environment = process.env.ENVIRONMENT;

  if (connectionUrl) {
    await createConnection({
      type: 'postgres',
      url: connectionUrl,
      entities: [
        path.join(__dirname, '../models/**{.ts,.js}'),
      ],
      logging: environment === 'development' ? true : false,
      ssl: {
        rejectUnauthorized: environment === 'production' ? true : false,
      },
    });
  } else {
    await createConnection({
      type: 'postgres',
      host,
      port: 5432,
      username,
      password,
      database,
      entities: [
        path.join(__dirname, '../models/**{.ts,.js}'),
      ],
      // synchronize: true,
      logging: environment === 'development' ? true : false,
    });
  }


  console.log('Postgres DB Connection Successful!', new Date());
  console.log('===================================================================');
}
