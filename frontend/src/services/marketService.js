import axios from 'axios';
import { API_URL } from '../config/constants';

const marketService = {
  /**
   * Get information about global markets
   */
  async getGlobalMarkets() {
    try {
      const response = await axios.get(`${API_URL}/market/global`);
      return response.data;
    } catch (error) {
      console.error('Error fetching global markets:', error);
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.warn('API rate limit exceeded. Using fallback data.');
      }
      // For development, return sample data if API fails
      return [
        { 
          symbol: 'VN-INDEX',
          name: 'VN-Index',
          country: 'Vietnam',
          price: 1250.46,
          change: 0.65
        },
        { 
          symbol: 'HNX-INDEX',
          name: 'HNX-Index',
          country: 'Vietnam',
          price: 245.32,
          change: 0.42
        },
        { 
          symbol: 'UPCOM-INDEX',
          name: 'UPCOM-Index',
          country: 'Vietnam',
          price: 89.75,
          change: -0.23
        },
        { 
          symbol: 'S&P500',
          name: 'S&P 500',
          country: 'USA',
          price: 4763.12,
          change: 1.25
        },
        { 
          symbol: 'DJIA',
          name: 'Dow Jones',
          country: 'USA',
          price: 37865.34,
          change: 0.98
        },
        { 
          symbol: 'NIKKEI',
          name: 'Nikkei 225',
          country: 'Japan',
          price: 33452.67,
          change: -0.45
        },
        { 
          symbol: 'HSI',
          name: 'Hang Seng',
          country: 'Hong Kong',
          price: 18234.56,
          change: -1.34
        },
        { 
          symbol: 'SHCOMP',
          name: 'Shanghai Composite',
          country: 'China',
          price: 3234.78,
          change: 0.23
        },
      ];
    }
  },

  /**
   * Get market insights data
   */
  async getMarketInsights() {
    try {
      const response = await axios.get(`${API_URL}/market/insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market insights:', error);
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.warn('API rate limit exceeded. Using fallback data.');
      }
      // For development, return sample data if API fails
      return {
        marketTrend: 'up',
        marketPercentage: 0.65,
        marketSummary: 'Vietnamese market is trending upward with strong gains in banking and tech sectors.',
        topMovers: [
          { symbol: 'VCB', change: 2.5, reason: 'Strong Q2 earnings' },
          { symbol: 'FPT', change: 3.1, reason: 'New tech partnership announced' },
          { symbol: 'MWG', change: -1.8, reason: 'Lower than expected sales figures' },
          { symbol: 'VIC', change: 1.4, reason: 'Real estate market recovery' },
        ],
        sectorPerformance: [
          { name: 'Banking', change: 1.8 },
          { name: 'Technology', change: 2.3 },
          { name: 'Real Estate', change: 0.9 },
          { name: 'Retail', change: -0.7 },
          { name: 'Energy', change: 0.4 },
        ],
        marketHeadlines: [
          'State Bank of Vietnam maintains key interest rate at 4.5%',
          'Foreign investors increase holdings in Vietnamese equities',
          'Tech sector leads market gains with average 2.3% increase',
          'Real estate recovery continues as VIC and VHM show strength'
        ]
      };
    }
  },

  /**
   * Get list of available exchanges
   */
  async getExchanges() {
    try {
      const response = await axios.get(`${API_URL}/market/exchanges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      // For development, return sample data if API fails
      return [
        { code: 'HOSE', name: 'Ho Chi Minh Stock Exchange' },
        { code: 'HNX', name: 'Hanoi Stock Exchange' },
        { code: 'UPCOM', name: 'Unlisted Public Company Market' }
      ];
    }
  },

  /**
   * Get stocks listed on a specific exchange
   */
  async getStocksByExchange(exchange) {
    try {
      const response = await axios.get(`${API_URL}/market/exchanges/${exchange}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stocks for exchange ${exchange}:`, error);
      
      // For development, return sample data if API fails
      // Different sample data for different exchanges
      if (exchange === 'HOSE') {
        return [
          { symbol: 'VCB', name: 'Vietcombank', price: 86500, change: 1.2, volume: 1543000 },
          { symbol: 'VIC', name: 'Vingroup', price: 45600, change: 0.8, volume: 2105000 },
          { symbol: 'VNM', name: 'Vinamilk', price: 78300, change: -0.5, volume: 987000 },
          { symbol: 'FPT', name: 'FPT Corporation', price: 93200, change: 2.3, volume: 1275000 },
          { symbol: 'MWG', name: 'Mobile World Group', price: 44500, change: -1.2, volume: 1875000 },
          { symbol: 'HPG', name: 'Hoa Phat Group', price: 23400, change: 0.6, volume: 2345000 },
          { symbol: 'VRE', name: 'Vincom Retail', price: 25800, change: 0.2, volume: 1045000 },
          { symbol: 'TCB', name: 'Techcombank', price: 31200, change: 1.5, volume: 1865000 },
          { symbol: 'MSN', name: 'Masan Group', price: 65400, change: 0.9, volume: 765000 },
          { symbol: 'VHM', name: 'Vinhomes', price: 52300, change: 0.7, volume: 1125000 }
        ];
      } else if (exchange === 'HNX') {
        return [
          { symbol: 'SHS', name: 'Saigon-Hanoi Securities', price: 12500, change: 0.8, volume: 865000 },
          { symbol: 'PVS', name: 'PV Technical Services', price: 19800, change: 1.1, volume: 765000 },
          { symbol: 'NVB', name: 'National Citizen Bank', price: 10200, change: -0.3, volume: 546000 },
          { symbol: 'TNG', name: 'TNG Investment & Trading', price: 15300, change: 0.5, volume: 345000 },
          { symbol: 'CEO', name: 'CEO Group', price: 14500, change: 0.2, volume: 432000 },
          { symbol: 'VCS', name: 'Vicostone', price: 68500, change: -0.7, volume: 234000 },
          { symbol: 'IDC', name: 'IDICO Corp', price: 24300, change: 1.8, volume: 345000 },
          { symbol: 'PLC', name: 'Petrolimex Petrochemical', price: 21500, change: 0.3, volume: 231000 },
          { symbol: 'PVG', name: 'PV Gas North', price: 11200, change: -0.5, volume: 187000 },
          { symbol: 'PTI', name: 'Post & Telecom Insurance', price: 16700, change: 0.6, volume: 254000 }
        ];
      } else { // UPCOM
        return [
          { symbol: 'VTP', name: 'Viettel Post', price: 43200, change: 0.4, volume: 345000 },
          { symbol: 'BSR', name: 'Binh Son Refining', price: 11800, change: -0.8, volume: 543000 },
          { symbol: 'QNS', name: 'Quang Ngai Sugar', price: 35600, change: 0.7, volume: 234000 },
          { symbol: 'ACV', name: 'Airports Corporation of VN', price: 67300, change: 1.2, volume: 456000 },
          { symbol: 'VGT', name: 'Vietnam National Textile', price: 12500, change: -0.5, volume: 321000 },
          { symbol: 'VEA', name: 'Vietnam Engine & Agricultural', price: 35600, change: 0.3, volume: 298000 },
          { symbol: 'TDM', name: 'Thu Dau Mot Water', price: 25900, change: -0.2, volume: 154000 },
          { symbol: 'POW', name: 'PetroVietnam Power', price: 12700, change: 0.6, volume: 543000 },
          { symbol: 'CTR', name: 'Viettel Construction', price: 43500, change: 1.1, volume: 243000 },
          { symbol: 'TCT', name: 'Taicera Enterprise', price: 6500, change: -0.9, volume: 157000 }
        ];
      }
    }
  },

  /**
   * Get daily market data for a specific date
   */
  async getDailyMarketData(date) {
    try {
      const response = await axios.get(`${API_URL}/markets/daily`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching daily market data for ${date}:`, error);
      throw error;
    }
  }
};

export default marketService;
