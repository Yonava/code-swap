import { createClient } from 'redis';

const REDIS_LOG_PREFIX = '[Redis Client]';
const redisLogger = (...msg: string[]) => () => console.log(`${REDIS_LOG_PREFIX}`, ...msg);

const createRedisClient = ({ nickname }: { nickname: string }) => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }
  });

  client.connect();

  client.on('connect', redisLogger(`${nickname} Connected`));
  client.on('error', redisLogger(`${nickname} Error`));
  client.on('reconnecting', redisLogger(`${nickname} Reconnecting`));
  client.on('ready', redisLogger(`${nickname} Ready`));
  client.on('end', redisLogger(`${nickname} End`));
  client.on('close', redisLogger(`${nickname} Closed`));

  return client
}

/**
 * singleton redis client for pub, sub and db
 */
export class RedisClient {
  private static instance: RedisClient;
  public pub;
  public sub;
  public db;

  private constructor() {
    this.pub = createRedisClient({ nickname: '👊 Publisher' });
    this.sub = createRedisClient({ nickname: '🐱 Subscriber' });
    this.db = createRedisClient({ nickname: '📚 Database' });
  }

  public static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }
}