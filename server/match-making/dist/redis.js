"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const REDIS_LOG_PREFIX = '[Redis Client]';
const redisLogger = (...msg) => () => console.log(`${REDIS_LOG_PREFIX}`, ...msg);
const createRedisClient = ({ nickname }) => {
    const client = (0, redis_1.createClient)({
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
    return client;
};
/**
 * singleton redis client for both publishing and subscribing to redis channels
 */
class RedisClient {
    static instance;
    pub;
    sub;
    db;
    constructor() {
        this.pub = createRedisClient({ nickname: '👊 Publisher' });
        this.sub = createRedisClient({ nickname: '🐱 Subscriber' });
        this.db = createRedisClient({ nickname: '📚 Database' });
    }
    static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }
}
exports.RedisClient = RedisClient;
