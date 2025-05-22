import { redis } from '@services';
import { logger } from '@configs';
import { redisConfig } from '@configs/redis';

// Cache key patterns
export const cacheKeys = {
    fileContent: (path: string) => `file:content:${path}`,
    directoryListing: (path: string) => `dir:listing:${path}`,
    searchResults: (path: string, keyString: string) => `search:${path}:${keyString}`,
    directoryCheck: (path: string) => `dir:check:${path}`
};

// Cache statistics
export const cacheStats = {
    // Global stats
    hits: 0,
    misses: 0,

    // Per endpoint stats
    endpoints: {
        fileContent: { hits: 0, misses: 0 },
        directoryListing: { hits: 0, misses: 0 },
        searchResults: { hits: 0, misses: 0 },
        directoryCheck: { hits: 0, misses: 0 }
    },

    // Timestamp of when stats started being collected
    startTime: Date.now(),

    // Get hit rate as percentage
    getHitRate(): number {
        const total = this.hits + this.misses;
        return total > 0 ? (this.hits / total) * 100 : 0;
    },

    // Get endpoint-specific hit rate
    getEndpointHitRate(endpoint: keyof typeof this.endpoints): number {
        const stats = this.endpoints[endpoint];
        const total = stats.hits + stats.misses;
        return total > 0 ? (stats.hits / total) * 100 : 0;
    },

    // Get stats summary
    getSummary(): CacheStatsSummary {
        const totalRequests = this.hits + this.misses;
        const uptime = Date.now() - this.startTime;

        return {
            totalRequests,
            hits: this.hits,
            misses: this.misses,
            hitRate: this.getHitRate(),
            uptime,
            endpointStats: {
                fileContent: {
                    hits: this.endpoints.fileContent.hits,
                    misses: this.endpoints.fileContent.misses,
                    hitRate: this.getEndpointHitRate('fileContent')
                },
                directoryListing: {
                    hits: this.endpoints.directoryListing.hits,
                    misses: this.endpoints.directoryListing.misses,
                    hitRate: this.getEndpointHitRate('directoryListing')
                },
                searchResults: {
                    hits: this.endpoints.searchResults.hits,
                    misses: this.endpoints.searchResults.misses,
                    hitRate: this.getEndpointHitRate('searchResults')
                },
                directoryCheck: {
                    hits: this.endpoints.directoryCheck.hits,
                    misses: this.endpoints.directoryCheck.misses,
                    hitRate: this.getEndpointHitRate('directoryCheck')
                }
            }
        };
    },

    // Reset all stats
    reset(): void {
        this.hits = 0;
        this.misses = 0;
        this.startTime = Date.now();

        Object.keys(this.endpoints).forEach(key => {
            const endpoint = key as keyof typeof this.endpoints;
            this.endpoints[endpoint].hits = 0;
            this.endpoints[endpoint].misses = 0;
        });
    }
};

// Type definition for cache stats summary
export interface CacheStatsSummary {
    totalRequests: number;
    hits: number;
    misses: number;
    hitRate: number;
    uptime: number;
    endpointStats: {
        [key: string]: {
            hits: number;
            misses: number;
            hitRate: number;
        }
    };
}

/**
 * Get data from cache
 * @param key Cache key
 * @returns Cached data or null if not found
 */
export async function getCache<T>(key: string): Promise<T | null> {
    try {
        if (!redis.status || redis.status !== 'ready') {
            logger.debug(`Cache get skipped: Redis not ready for key ${key}`);
            return null;
        }

        // Determine which endpoint this key belongs to
        let endpoint: keyof typeof cacheStats.endpoints | null = null;

        if (key.startsWith('file:content:')) {
            endpoint = 'fileContent';
        } else if (key.startsWith('dir:listing:')) {
            endpoint = 'directoryListing';
        } else if (key.startsWith('search:')) {
            endpoint = 'searchResults';
        } else if (key.startsWith('dir:check:')) {
            endpoint = 'directoryCheck';
        }

        logger.debug(`Cache lookup: Attempting to get key ${key}`);
        const data = await redis.get(key);
        if (!data) {
            // Increment global miss counter
            cacheStats.misses++;

            // Increment endpoint-specific miss counter if applicable
            if (endpoint) {
                cacheStats.endpoints[endpoint].misses++;
            }

            logger.debug(`Cache MISS: Key ${key} not found in cache`);
            return null;
        }

        // Increment global hit counter
        cacheStats.hits++;

        // Increment endpoint-specific hit counter if applicable
        if (endpoint) {
            cacheStats.endpoints[endpoint].hits++;
        }

        logger.debug(`Cache HIT: Key ${key} found in cache`);
        return JSON.parse(data) as T;
    } catch (error) {
        logger.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
}

/**
 * Set data in cache with TTL
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in seconds
 */
export async function setCache<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
        if (!redis.status || redis.status !== 'ready') {
            logger.debug(`Cache set skipped: Redis not ready for key ${key}`);
            return;
        }

        logger.debug(`Cache SET: Storing key ${key} with TTL ${ttl}s`);
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
        logger.debug(`Cache SET complete: Key ${key} stored successfully`);
    } catch (error) {
        logger.error(`Error setting cache for key ${key}:`, error);
    }
}

/**
 * Delete specific cache entry
 * @param key Cache key
 */
export async function deleteCache(key: string): Promise<void> {
    try {
        if (!redis.status || redis.status !== 'ready') {
            logger.debug(`Cache delete skipped: Redis not ready for key ${key}`);
            return;
        }

        logger.debug(`Cache DELETE: Removing key ${key}`);
        const result = await redis.del(key);
        logger.debug(`Cache DELETE complete: Removed ${result} keys for ${key}`);
    } catch (error) {
        logger.error(`Error deleting cache for key ${key}:`, error);
    }
}

/**
 * Delete cache entries by pattern
 * @param pattern Key pattern to match
 */
export async function deleteCacheByPattern(pattern: string): Promise<void> {
    try {
        if (!redis.status || redis.status !== 'ready') {
            logger.debug(`Cache delete by pattern skipped: Redis not ready for pattern ${pattern}`);
            return;
        }

        logger.debug(`Cache DELETE BY PATTERN: Searching for keys matching pattern ${pattern}`);

        // Use SCAN to find keys matching the pattern
        let cursor = '0';
        let totalDeleted = 0;

        do {
            const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', redisConfig.keyPrefix + pattern, 'COUNT', 100);
            cursor = nextCursor;

            if (keys.length > 0) {
                // Remove prefix from keys
                const keysWithoutPrefix = keys.map(key => key.replace(redisConfig.keyPrefix, ''));
                logger.debug(`Cache DELETE BY PATTERN: Found ${keys.length} keys matching ${pattern}`);

                const result = await redis.del(...keysWithoutPrefix);
                totalDeleted += result;
            }
        } while (cursor !== '0');

        logger.debug(`Cache DELETE BY PATTERN complete: Removed ${totalDeleted} keys for pattern ${pattern}`);
    } catch (error) {
        logger.error(`Error deleting cache by pattern ${pattern}:`, error);
    }
}

/**
 * Invalidate file content cache
 * @param path File path
 */
export async function invalidateFileCache(path: string): Promise<void> {
    logger.debug(`Cache invalidation: File content for path ${path}`);
    await deleteCache(cacheKeys.fileContent(path));
}

/**
 * Invalidate directory listing cache
 * @param path Directory path
 */
export async function invalidateDirectoryCache(path: string): Promise<void> {
    logger.debug(`Cache invalidation: Directory listing for path ${path}`);
    await deleteCache(cacheKeys.directoryListing(path));

    // Also invalidate parent directory
    const parentPath = path.split('/').slice(0, -1).join('/');
    if (parentPath) {
        logger.debug(`Cache invalidation: Parent directory listing for path ${parentPath}`);
        await deleteCache(cacheKeys.directoryListing(parentPath));
    }
}

/**
 * Invalidate search results cache for a directory
 * @param path Directory path
 */
export async function invalidateSearchCache(path: string): Promise<void> {
    logger.debug(`Cache invalidation: Search results for path ${path}`);
    await deleteCacheByPattern(`search:${path}:*`);
}

/**
 * Invalidate directory check cache
 * @param path Directory path
 */
export async function invalidateDirectoryCheckCache(path: string): Promise<void> {
    logger.debug(`Cache invalidation: Directory check for path ${path}`);
    await deleteCache(cacheKeys.directoryCheck(path));
}

/**
 * Invalidate all caches related to a path
 * @param path File or directory path
 */
export async function invalidateAllCaches(path: string): Promise<void> {
    logger.debug(`Cache invalidation: ALL caches for path ${path}`);
    await Promise.all([
        invalidateFileCache(path),
        invalidateDirectoryCache(path),
        invalidateSearchCache(path),
        invalidateDirectoryCheckCache(path)
    ]);
    logger.debug(`Cache invalidation complete: ALL caches for path ${path}`);
}
