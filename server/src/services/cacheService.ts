import NodeCache from 'node-cache';

export interface CacheEntry<T> {
  data: T;
  timestamp: string;
}

class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ 
      stdTTL: ttlSeconds, 
      checkperiod: ttlSeconds * 0.2,
      useClones: false // performance improvement for in-memory cache
    });
  }

  get<T>(key: string): CacheEntry<T> | null {
    const value = this.cache.get<CacheEntry<T>>(key);
    if (value !== undefined) {
      console.log(`\x1b[32m[Cache HIT]\x1b[0m Key: "${key}"`);
      return value;
    }
    console.log(`\x1b[31m[Cache MISS]\x1b[0m Key: "${key}"`);
    return null;
  }

  set<T>(key: string, data: T): void {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: new Date().toISOString(),
    };
    this.cache.set(key, cacheEntry);
    console.log(`\x1b[36m[Cache SET]\x1b[0m Key: "${key}"`);
  }
}

export const cacheService = new CacheService(60); // 60 seconds TTL default
