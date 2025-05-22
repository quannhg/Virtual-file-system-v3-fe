import { Static, Type } from '@sinclair/typebox';

// Define the endpoint stats structure
const EndpointStats = Type.Object({
    hits: Type.Number(),
    misses: Type.Number(),
    hitRate: Type.Number()
});

// Define the uptime structure
const Uptime = Type.Object({
    ms: Type.Number(),
    seconds: Type.Number(),
    minutes: Type.Number(),
    hours: Type.Number(),
    days: Type.Number()
});

// Define the cache stats response
export const CacheStatsResult = Type.Object({
    totalRequests: Type.Number(),
    hits: Type.Number(),
    misses: Type.Number(),
    hitRate: Type.Number(),
    uptime: Uptime,
    endpointStats: Type.Object({
        fileContent: EndpointStats,
        directoryListing: EndpointStats,
        searchResults: EndpointStats,
        directoryCheck: EndpointStats
    }),
    timestamp: Type.String()
});

export type CacheStatsResult = Static<typeof CacheStatsResult>;

// Define the reset cache stats response
export const ResetCacheStatsResult = Type.Object({
    message: Type.String()
});

export type ResetCacheStatsResult = Static<typeof ResetCacheStatsResult>;
