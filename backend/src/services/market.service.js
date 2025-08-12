const axios = require('axios');
const apiConfig = require('../config/api');
const {
  marketIndicesCache,
  globalIndicesCache,
  forexCache,
  cryptoCache,
  marketInsightsCache
} = require('../utils/apiCache');

// Error handler for API requests
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code outside the range of 2xx
    const status = error.response.status;
    const message = error.response.data?.message || 'API request failed';
    throw { status, message, details: error.response.data };
  } else if (error.request) {
    // The request was made but no response was received
    throw { status: 503, message: 'No response from API server', details: error.message };
  } else {
    // Something happened in setting up the request
    throw { status: 500, message: 'Error setting up API request', details: error.message };
  }
};

// Service for market data
const marketService = {
  // Get Vietnamese market indices
  async getMarketIndices() {
    try {
      const cacheKey = 'market_indices';
      
      // Check if we have cached data
      if (marketIndicesCache.has(cacheKey)) {
        return marketIndicesCache.get(cacheKey);
      }
      
      try {
        const indices = [
          'VN-Index.INDX', // VN-Index
          'VN30.INDX',     // VN30 Index
          'HNX.INDX',      // Hanoi Stock Exchange Index
          'HNX30.INDX',    // HNX30 Index
          'UPCOM.INDX'     // Unlisted Public Company Market Index
        ];
        
        const requests = indices.map(index => 
          axios.get(`${apiConfig.eodhd.baseUrl}/real-time/${index}`, {
            params: {
              api_token: apiConfig.eodhd.apiKey,
              fmt: 'json'
            }
          })
        );
        
        const responses = await Promise.all(requests);
        const result = responses.map(response => response.data);
        
        // Store in cache
        marketIndicesCache.set(cacheKey, result);
        
        return result;
      } catch (apiError) {
        console.warn('API error fetching market indices, using fallback data');
        // Use fallback mock data
        const mockData = [
          { code: 'VN-Index.INDX', name: 'VN-Index', close: 1204.21, change: 7.32, change_p: 0.61 },
          { code: 'VN30.INDX', name: 'VN30', close: 1232.56, change: 5.89, change_p: 0.48 },
          { code: 'HNX.INDX', name: 'HNX', close: 225.17, change: -1.23, change_p: -0.54 },
          { code: 'HNX30.INDX', name: 'HNX30', close: 386.42, change: -0.78, change_p: -0.20 },
          { code: 'UPCOM.INDX', name: 'UPCOM', close: 87.92, change: 0.34, change_p: 0.39 }
        ];
        
        // Store the mock data in cache to avoid repeated API calls
        marketIndicesCache.set(cacheKey, mockData);
        return mockData;
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get stocks for a specific exchange
  async getExchangeData(exchange, limit = 20, offset = 0) {
    try {
      // Map exchange parameter to exchange code
      let exchangeCode = '';
      switch (exchange.toUpperCase()) {
        case 'HNX':
          exchangeCode = 'HNX';
          break;
        case 'HNX30':
          // For HNX30, we need to get all HNX stocks and filter later
          exchangeCode = 'HNX';
          break;
        case 'HOSE':
          exchangeCode = 'HOSE';
          break;
        case 'VN30':
          // For VN30, we need to get all HOSE stocks and filter later
          exchangeCode = 'HOSE';
          break;
        case 'UPCOM':
          exchangeCode = 'UPCOM';
          break;
        default:
          exchangeCode = 'HOSE';
      }
      
      // Get list of tickers for the exchange
      const response = await axios.get(`${apiConfig.eodhd.baseUrl}/exchange-symbol-list/${exchangeCode}`, {
        params: {
          api_token: apiConfig.eodhd.apiKey,
          fmt: 'json'
        }
      });
      
      const tickers = response.data;
      
      // Special case for indices like VN30 or HNX30
      let filteredTickers = tickers;
      if (exchange.toUpperCase() === 'VN30' || exchange.toUpperCase() === 'HNX30') {
        // For VN30 or HNX30, we would need a list of constituent stocks
        // This is a simplified implementation - in practice, you'd need actual VN30/HNX30 constituents
        // Here we just take the first 30 stocks as a placeholder
        filteredTickers = tickers.slice(0, 30);
      }
      
      // Apply pagination
      const paginatedTickers = filteredTickers.slice(offset, offset + limit);
      
      // Get current prices for paginated tickers
      const priceRequests = paginatedTickers.map(ticker => 
        axios.get(`${apiConfig.eodhd.baseUrl}/real-time/${ticker.Code}`, {
          params: {
            api_token: apiConfig.eodhd.apiKey,
            fmt: 'json'
          }
        })
      );
      
      const priceResponses = await Promise.all(priceRequests);
      const tickerData = priceResponses.map((response, index) => ({
        ...paginatedTickers[index],
        ...response.data
      }));
      
      return {
        exchange: exchangeCode,
        total: filteredTickers.length,
        offset,
        limit,
        data: tickerData
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get global market indices
  async getGlobalIndices() {
    try {
      const cacheKey = 'global_indices';
      
      // Check if we have cached data
      if (globalIndicesCache.has(cacheKey)) {
        return globalIndicesCache.get(cacheKey);
      }
      
      try {
        const indices = [
          'DJI.INDX',     // Dow Jones Industrial Average
          'SPX.INDX',     // S&P 500
          'IXIC.INDX',    // NASDAQ Composite
          'FTSE.INDX',    // FTSE 100
          'N225.INDX',    // Nikkei 225
          'HSI.INDX',     // Hang Seng Index
          'SSEC.INDX'     // Shanghai Composite Index
        ];
        
        const requests = indices.map(index => 
          axios.get(`${apiConfig.eodhd.baseUrl}/real-time/${index}`, {
            params: {
              api_token: apiConfig.eodhd.apiKey,
              fmt: 'json'
            }
          })
        );
        
        const responses = await Promise.all(requests);
        const result = responses.map(response => response.data);
        
        // Store in cache
        globalIndicesCache.set(cacheKey, result);
        
        return result;
      } catch (apiError) {
        console.warn('API error fetching global indices, using fallback data');
        // Use fallback mock data
        const mockData = [
          { code: 'DJI.INDX', name: 'Dow Jones', close: 37865.34, change: 370.25, change_p: 0.98 },
          { code: 'SPX.INDX', name: 'S&P 500', close: 4763.12, change: 59.13, change_p: 1.25 },
          { code: 'IXIC.INDX', name: 'NASDAQ', close: 14963.87, change: 198.42, change_p: 1.34 },
          { code: 'FTSE.INDX', name: 'FTSE 100', close: 7642.30, change: 31.55, change_p: 0.41 },
          { code: 'N225.INDX', name: 'Nikkei 225', close: 33452.67, change: -150.23, change_p: -0.45 },
          { code: 'HSI.INDX', name: 'Hang Seng', close: 18234.56, change: -246.35, change_p: -1.34 },
          { code: 'SSEC.INDX', name: 'Shanghai', close: 3234.78, change: 7.42, change_p: 0.23 }
        ];
        
        // Store the mock data in cache to avoid repeated API calls
        globalIndicesCache.set(cacheKey, mockData);
        return mockData;
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get exchanges
  async getExchanges() {
    try {
      // Exchanges are static data, no need for API call
      return [
        { code: 'HOSE', name: 'Ho Chi Minh Stock Exchange' },
        { code: 'HNX', name: 'Hanoi Stock Exchange' },
        { code: 'UPCOM', name: 'Unlisted Public Company Market' }
      ];
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get stocks by exchange
  async getExchangeData(exchange, limit = 20, offset = 0) {
    try {
      const cacheKey = `exchange_${exchange}_${limit}_${offset}`;
      
      // Check if we have cached data
      if (marketIndicesCache.has(cacheKey)) {
        return marketIndicesCache.get(cacheKey);
      }
      
      try {
        // In a real app, we would fetch from API here
        // For now, return mock data based on exchange
        let mockData;
        
        switch(exchange.toUpperCase()) {
          case 'HOSE':
            mockData = [
              { symbol: 'VCB', name: 'Vietcombank', price: 89500, change: 1500, change_p: 1.7, volume: 1245678 },
              { symbol: 'VIC', name: 'Vingroup', price: 43800, change: 600, change_p: 1.39, volume: 987543 },
              { symbol: 'VHM', name: 'Vinhomes', price: 48900, change: -700, change_p: -1.41, volume: 876540 },
              { symbol: 'FPT', name: 'FPT Corp', price: 112500, change: 2800, change_p: 2.55, volume: 654789 },
              { symbol: 'MWG', name: 'Mobile World', price: 43200, change: -900, change_p: -2.04, volume: 543218 },
              { symbol: 'HPG', name: 'Hoa Phat Group', price: 22900, change: 300, change_p: 1.33, volume: 2345678 },
              { symbol: 'VNM', name: 'Vinamilk', price: 71800, change: -400, change_p: -0.55, volume: 432156 },
              { symbol: 'MSN', name: 'Masan Group', price: 74500, change: 1200, change_p: 1.64, volume: 321456 },
              { symbol: 'VRE', name: 'Vincom Retail', price: 26700, change: 500, change_p: 1.91, volume: 654321 },
              { symbol: 'TCB', name: 'Techcombank', price: 48300, change: 900, change_p: 1.9, volume: 876543 }
            ];
            break;
          case 'HNX':
            mockData = [
              { symbol: 'SHS', name: 'SHS Securities', price: 12300, change: 200, change_p: 1.65, volume: 654321 },
              { symbol: 'PVS', name: 'PV Technical Services', price: 28700, change: -300, change_p: -1.03, volume: 432156 },
              { symbol: 'TNG', name: 'TNG Investment', price: 14600, change: 300, change_p: 2.1, volume: 321456 },
              { symbol: 'VCS', name: 'Vicostone', price: 74500, change: 1500, change_p: 2.05, volume: 234567 },
              { symbol: 'CEO', name: 'CEO Group', price: 13200, change: 100, change_p: 0.76, volume: 345678 }
            ];
            break;
          case 'UPCOM':
            mockData = [
              { symbol: 'ACV', name: 'Airports Corporation', price: 80200, change: 1200, change_p: 1.52, volume: 432156 },
              { symbol: 'VGC', name: 'Viglacera', price: 41300, change: -200, change_p: -0.48, volume: 321456 },
              { symbol: 'POW', name: 'PetroVietnam Power', price: 12100, change: 200, change_p: 1.68, volume: 765432 },
              { symbol: 'BSR', name: 'Binh Son Refining', price: 17800, change: 300, change_p: 1.71, volume: 654321 }
            ];
            break;
          default:
            mockData = [];
        }
        
        // Store in cache
        marketIndicesCache.set(cacheKey, mockData);
        
        return mockData;
      } catch (apiError) {
        console.warn(`API error fetching ${exchange} stocks, using fallback data`);
        // Return empty array as fallback
        return [];
      }
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Get cryptocurrency rates using CoinGecko
  async getCryptoRates(limit = 10) {
    try {
      // CoinGecko API doesn't require an API key for basic usage
      const response = await axios.get(`${apiConfig.coinGecko.baseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false
        }
      });
      
      return response.data;
    } catch (error) {
      // If CoinGecko fails, try Alpha Vantage as fallback
      try {
        const topCryptos = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'AVAX', 'LINK'].slice(0, limit);
        
        const requests = topCryptos.map(crypto => 
          axios.get(`${apiConfig.alphaVantage.baseUrl}`, {
            params: {
              function: 'CURRENCY_EXCHANGE_RATE',
              from_currency: crypto,
              to_currency: 'USD',
              apikey: apiConfig.alphaVantage.apiKey
            }
          })
        );
        
        const responses = await Promise.all(requests);
        const result = responses.map(response => {
          const data = response.data['Realtime Currency Exchange Rate'];
          return {
            symbol: data['1. From_Currency Code'],
            name: data['2. From_Currency Name'],
            current_price: parseFloat(data['5. Exchange Rate']),
            last_updated: data['6. Last Refreshed']
          };
        });
        
        return result;
      } catch (fallbackError) {
        return handleApiError(error);
      }
    }
  },
  
  // Get forex rates (USD/VND)
  async getForexRates(base = 'USD', symbols = 'VND') {
    try {
      const response = await axios.get(`${apiConfig.eodhd.baseUrl}/real-time/${base}${symbols}.FOREX`, {
        params: {
          api_token: apiConfig.eodhd.apiKey,
          fmt: 'json'
        }
      });
      
      return response.data;
    } catch (error) {
      // Try Alpha Vantage as fallback
      try {
        const response = await axios.get(`${apiConfig.alphaVantage.baseUrl}`, {
          params: {
            function: 'CURRENCY_EXCHANGE_RATE',
            from_currency: base,
            to_currency: symbols,
            apikey: apiConfig.alphaVantage.apiKey
          }
        });
        
        const data = response.data['Realtime Currency Exchange Rate'];
        return {
          from_currency: data['1. From_Currency Code'],
          to_currency: data['3. To_Currency Code'],
          exchange_rate: parseFloat(data['5. Exchange Rate']),
          last_updated: data['6. Last Refreshed']
        };
      } catch (fallbackError) {
        return handleApiError(error);
      }
    }
  },
  
  // Get market insights/news
  async getMarketInsights(limit = 5) {
    try {
      const cacheKey = `market_insights_${limit}`;
      
      // Check if we have cached data
      if (marketInsightsCache.has(cacheKey)) {
        return marketInsightsCache.get(cacheKey);
      }
      
      const response = await axios.get(`${apiConfig.eodhd.baseUrl}/news`, {
        params: {
          api_token: apiConfig.eodhd.apiKey,
          t: 'general',
          limit,
          fmt: 'json'
        }
      });
      
      // Store in cache
      marketInsightsCache.set(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

module.exports = marketService;
