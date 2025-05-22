import Redis from 'ioredis';
import { redisConfig } from '@configs/redis';
import { logger } from '@configs';

class RedisService {
    private client: Redis;
    private isConnected: boolean = false;

    constructor() {
        this.client = new Redis({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            keyPrefix: redisConfig.keyPrefix,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.client.on('connect', () => {
            this.isConnected = true;
            logger.info('Redis client connected');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            logger.error('Redis client error:', err);
        });

        this.client.on('reconnecting', () => {
            logger.info('Redis client reconnecting');
        });
    }

    getClient(): Redis {
        return this.client;
    }

    isReady(): boolean {
        return this.isConnected;
    }

    async close(): Promise<void> {
        await this.client.quit();
    }
}

// Singleton instance
export const redisService = new RedisService();
export const redis = redisService.getClient();
