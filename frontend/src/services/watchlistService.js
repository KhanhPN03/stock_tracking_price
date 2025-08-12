import axios from 'axios';
import { API_URL } from '../config/constants';

const watchlistService = {
  /**
   * Get all watchlists for the current user
   */
  async getWatchlists() {
    try {
      const response = await axios.get(`${API_URL}/watchlists`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      
      // For development, return sample data if API fails
      return [
        {
          id: 1,
          name: 'My Favorites',
          stocks: [
            { 
              symbol: 'VCB',
              name: 'Vietcombank',
              price: 86500,
              change: 1.2,
              percentChange: 1.2
            },
            { 
              symbol: 'FPT',
              name: 'FPT Corporation',
              price: 93200,
              change: 2.3,
              percentChange: 2.3
            },
            { 
              symbol: 'VNM',
              name: 'Vinamilk',
              price: 78300,
              change: -0.5,
              percentChange: -0.5
            }
          ]
        },
        {
          id: 2,
          name: 'Tech Stocks',
          stocks: [
            { 
              symbol: 'FPT',
              name: 'FPT Corporation',
              price: 93200,
              change: 2.3,
              percentChange: 2.3
            },
            { 
              symbol: 'CMG',
              name: 'CMC Group',
              price: 48700,
              change: 0.8,
              percentChange: 0.8
            }
          ]
        }
      ];
    }
  },

  /**
   * Get a specific watchlist by ID
   */
  async getWatchlist(id) {
    try {
      const response = await axios.get(`${API_URL}/watchlists/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new watchlist
   */
  async createWatchlist(name) {
    try {
      const response = await axios.post(`${API_URL}/watchlists`, { name });
      return response.data;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      
      // For development, return sample data
      return {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID for demo
        name: name,
        stocks: []
      };
    }
  },

  /**
   * Update a watchlist
   */
  async updateWatchlist(id, name) {
    try {
      const response = await axios.put(`${API_URL}/watchlists/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error(`Error updating watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a watchlist
   */
  async deleteWatchlist(id) {
    try {
      await axios.delete(`${API_URL}/watchlists/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting watchlist ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add a stock to a watchlist
   */
  async addStockToWatchlist(watchlistId, stock) {
    try {
      const response = await axios.post(
        `${API_URL}/watchlists/${watchlistId}/stocks`, 
        { symbol: stock.symbol, name: stock.name }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding stock to watchlist ${watchlistId}:`, error);
      throw error;
    }
  },

  /**
   * Remove a stock from a watchlist
   */
  async removeStockFromWatchlist(watchlistId, stockSymbol) {
    try {
      await axios.delete(`${API_URL}/watchlists/${watchlistId}/stocks/${stockSymbol}`);
      return true;
    } catch (error) {
      console.error(`Error removing stock ${stockSymbol} from watchlist ${watchlistId}:`, error);
      throw error;
    }
  }
};

export default watchlistService;
