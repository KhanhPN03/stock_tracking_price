// Cache utility for API responses
class ApiCache {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttlSeconds = ttlSeconds;
  }

  set(key, data) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      expires: now + (this.ttlSeconds * 1000)
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Return null if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() <= item.expires;
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  invalidateAll() {
    this.cache.clear();
  }
}

// Create different cache instances with different TTLs
module.exports = {
  marketIndicesCache: new ApiCache(300), // 5 minutes for market indices
  globalIndicesCache: new ApiCache(900), // 15 minutes for global indices
  forexCache: new ApiCache(1800),        // 30 minutes for forex rates
  cryptoCache: new ApiCache(600),        // 10 minutes for crypto
  marketInsightsCache: new ApiCache(1200) // 20 minutes for market insights
};
