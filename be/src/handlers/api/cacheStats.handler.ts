import { CacheStatsResult, ResetCacheStatsResult } from '@dtos/out';
import { Handler } from '@interfaces';
import { cacheStats } from '@utils';
import { logger } from '@configs';

/**
 * Handler for retrieving cache statistics
 */
export const getCacheStats: Handler<CacheStatsResult> = async (_req, res) => {
    try {
        const stats = cacheStats.getSummary();

        // Format uptime in a human-readable format
        const uptime = {
            ms: stats.uptime,
            seconds: Math.floor(stats.uptime / 1000),
            minutes: Math.floor(stats.uptime / (1000 * 60)),
            hours: Math.floor(stats.uptime / (1000 * 60 * 60)),
            days: Math.floor(stats.uptime / (1000 * 60 * 60 * 24))
        };

        return res.send({
            ...stats,
            uptime,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        logger.error('Error getting cache statistics:', err);
        return res.internalServerError();
    }
};

/**
 * Handler for resetting cache statistics
 */
export const resetCacheStats: Handler<ResetCacheStatsResult> = async (_req, res) => {
    try {
        cacheStats.reset();
        return res.send({ message: 'Cache statistics reset successfully' });
    } catch (err) {
        logger.error('Error resetting cache statistics:', err);
        return res.internalServerError();
    }
};
