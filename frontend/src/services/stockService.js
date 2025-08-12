import axios from 'axios';
import { API_URL } from '../config/constants';

const stockService = {
  /**
   * Search stocks by keyword
   */
  async searchStocks(keyword) {
    try {
      const response = await axios.get(`${API_URL}/stocks/search`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific stock
   */
  async getStockDetails(symbol) {
    try {
      const response = await axios.get(`${API_URL}/stocks/${symbol}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for stock ${symbol}:`, error);
      
      // For development, return sample data if API fails
      return {
        symbol: symbol,
        name: `${symbol} Corporation`,
        price: 52500,
        change: 1.25,
        percentChange: 2.44,
        volume: 1234500,
        avgVolume: 1345600,
        high: 52800,
        low: 51900,
        open: 52000,
        previousClose: 51850,
        marketCap: 52300000000000,
        pe: 15.2,
        eps: 3452,
        dividend: 1.75,
        yearHigh: 57500,
        yearLow: 43200,
        sector: 'Technology',
        industry: 'Software & Services',
        exchange: 'HOSE'
      };
    }
  },

  /**
   * Get historical price data for a stock
   */
  async getHistoricalData(symbol, timeframe = '1m') {
    try {
      const response = await axios.get(`${API_URL}/stocks/${symbol}/history`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for stock ${symbol}:`, error);
      
      // Generate sample data for development
      const today = new Date();
      const data = [];
      let price = 52500;
      
      // Generate different amounts of data points based on timeframe
      let days;
      switch(timeframe) {
        case '1d': days = 1; break;
        case '1w': days = 7; break;
        case '1m': days = 30; break;
        case '3m': days = 90; break;
        case '1y': days = 365; break;
        case '5y': days = 365 * 5; break;
        default: days = 30;
      }
      
      // Generate a point per day for the specified timeframe
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Add some randomness to the price
        const change = (Math.random() * 2 - 1) * (price * 0.02);
        price += change;
        price = Math.max(price, 10000); // Ensure price doesn't go too low
        
        data.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price),
          volume: Math.floor(Math.random() * 2000000) + 500000
        });
      }
      
      return data;
    }
  },

  /**
   * Get news related to a stock
   */
  async getStockNews(symbol) {
    try {
      const response = await axios.get(`${API_URL}/stocks/${symbol}/news`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching news for stock ${symbol}:`, error);
      
      // For development, return sample data if API fails
      return [
        {
          id: 1,
          title: `${symbol} reports strong quarterly earnings, exceeding expectations`,
          source: 'VN Finance',
          date: '2023-08-05',
          url: '#',
          summary: `${symbol} Corporation announced quarterly earnings today, reporting a 15% increase in revenue compared to the same period last year. The company's profits rose by 22%, exceeding analyst expectations.`
        },
        {
          id: 2,
          title: `${symbol} expands operations with new facility in Danang`,
          source: 'Vietnam Business Review',
          date: '2023-08-03',
          url: '#',
          summary: `${symbol} Corporation has announced plans to expand its operations with a new manufacturing facility in Danang. The expansion is expected to create 500 new jobs and increase production capacity by 30%.`
        },
        {
          id: 3,
          title: `${symbol} signs strategic partnership with global tech firm`,
          source: 'Tech Vietnam',
          date: '2023-07-28',
          url: '#',
          summary: `${symbol} has formed a strategic partnership with a leading global technology company to develop innovative solutions for the Vietnamese market. This partnership is expected to accelerate ${symbol}'s digital transformation initiatives.`
        },
        {
          id: 4,
          title: `Analysts raise target price for ${symbol} following strong performance`,
          source: 'Market Watch VN',
          date: '2023-07-22',
          url: '#',
          summary: `Several market analysts have raised their target price for ${symbol} following the company's strong performance in the first half of the year. The consensus now points to a 15% upside potential.`
        }
      ];
    }
  }
};

export default stockService;
