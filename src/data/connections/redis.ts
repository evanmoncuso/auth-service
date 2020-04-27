import { RedisClient, createClient} from 'redis';

// export interface ClientInterface {
//   state?: string;

//   get: (key: string) => Promise<string>;
//   setWithExpire: (key: string, value: string, expireAt: number | Date) => Promise<boolean>;
// }

export let client: Client | null = null;

class Client {
  state?: string;

  constructor(private c: RedisClient) {
    this.state = 'initialized';

    c.on('connect', () => {
      this.state = 'connected'
    });
  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.c.get(key, (err, result) => {
        if (err) {
          reject(err)
          return;
        }

        resolve(result)
      })
    });
  }

  setWithExpire(key: string, value: string, expireAt: number | Date): Promise<string> {
    // https://redis.io/commands/set - with PX of whatever the expiration time on the token is
    return new Promise((resolve, reject) => {
      if (typeof expireAt !== 'number') {
        expireAt = expireAt.getTime();
      }

      this.c
        .multi()
        .set(key, value)
        .expireat(key, expireAt)
        .exec((err) => {
          if (err) {
            reject(err);
            return
          }
          resolve('OK')
        });

    });
  }
}

function _connect(url: string): Promise<RedisClient> {
  return new Promise((resolve) => {
    const c = createClient({ url, });
    c.on('ready', () => {
      resolve(c);
    });
  })
}

export function getClient(): Client | null { return client }

export async function initializeRedis(): Promise<void> {
  try {
    console.log('Trying to initialize Redis connection');
    const redisConnectionURL = process.env.REDIS_URL;
    if (!redisConnectionURL) throw new Error('Unable to connect to Redis. No Connection URL Provided');

    const c = await _connect(redisConnectionURL);

    client = new Client(c);

    console.log('Redis DB    Connection Successful!', new Date());
    console.log('===================================================================');
  } catch (e) {
    console.log('REDIS ERROR', e);
    throw e
  }
}