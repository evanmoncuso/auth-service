import * as express from 'express';
import * as bp from 'body-parser';
import * as cors from 'cors';

import { initializePostgres, initializeRedis } from './data/initialize';

import authenticate from './routes/authenticate';
import invalidate from './routes/invalidate';
import refresh from './routes/refresh';

const PORT = process.env.PORT;

export default async function main(): Promise<void> {
  try {
    if (!PORT) {
      throw new Error('No PORT specified')
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('No ACCESS_TOKEN_SECRET provided');
    }

    await initializePostgres();
    await initializeRedis();

    const app = express();

    // Setup app usables
    app.use(cors());
    app.use(bp.urlencoded({ extended: false, }));
    app.use(bp.text());

    app.use(bp.json({
      type: [
        'application/json',
        'application/vnd.api+json',
      ],
    }));

    // logger
    app.use((req: express.Request, _, next: express.NextFunction) => {
      console.log(`[ ${req.method} ] :: ${req.url} - ${new Date()}`)
      next();
    });

    app.get('/health', (_, res: express.Response) => {
      res.sendStatus(204);
    });

    app.post('/authenticate', authenticate);
    app.post('/invalidate', invalidate);

    app.post('/refresh', refresh);

    app.listen(PORT, () => {
      console.log(`listening on port: ${PORT}`);
    });
  } catch(e) {
    console.log('error', e);
  }
}

main();