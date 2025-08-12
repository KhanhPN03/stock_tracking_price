module.exports = {
  // EODHD API configuration
  eodhd: {
    baseUrl: 'https://eodhd.com/api',
    apiKey: process.env.EODHD_API_KEY || 'your-eodhd-api-key'
  },
  
  // Twelve Data API configuration
  twelveData: {
    baseUrl: 'https://api.twelvedata.com',
    apiKey: process.env.TWELVEDATA_API_KEY || 'your-twelvedata-api-key',
    websocketUrl: 'wss://ws.twelvedata.com/v1'
  },
  
  // Alpha Vantage API configuration (as backup)
  alphaVantage: {
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || 'your-alpha-vantage-api-key'
  },
  
  // CoinGecko API for cryptocurrency data
  coinGecko: {
    baseUrl: 'https://api.coingecko.com/api/v3'
  }
};
