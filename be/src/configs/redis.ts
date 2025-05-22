import { envs } from './env';

export const redisConfig = {
    host: envs.REDIS_HOST || 'localhost',
    port: envs.REDIS_PORT || 6379,
    password: envs.REDIS_PASSWORD || undefined,
    db: envs.REDIS_DB || 0,
    keyPrefix: envs.REDIS_PREFIX || 'vfs:',
    // Default TTL values for different cache types (in seconds)
    ttl: {
        fileContent: 3600, // 1 hour for file content
        directoryListing: 1800, // 30 minutes for directory listings
        searchResults: 600, // 10 minutes for search results
        directoryCheck: 300 // 5 minutes for directory existence checks
    }
};
