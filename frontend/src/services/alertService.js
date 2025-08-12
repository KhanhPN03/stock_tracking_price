import axios from 'axios';
import { API_URL } from '../config/constants';

const alertService = {
  /**
   * Get all price alerts for the current user
   */
  async getAlerts(filter = 'all') {
    try {
      const response = await axios.get(`${API_URL}/alerts`, {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      
      // For development, return sample data if API fails
      const sampleAlerts = [
        {
          id: 1,
          stockSymbol: 'VCB',
          stockName: 'Vietcombank',
          currentPrice: 86500,
          targetPrice: 90000,
          condition: 'above',
          isActive: true,
          triggered: false,
          createdAt: '2023-08-01T10:30:00Z'
        },
        {
          id: 2,
          stockSymbol: 'FPT',
          stockName: 'FPT Corporation',
          currentPrice: 93200,
          targetPrice: 95000,
          condition: 'above',
          isActive: true,
          triggered: false,
          createdAt: '2023-08-02T09:15:00Z'
        },
        {
          id: 3,
          stockSymbol: 'VNM',
          stockName: 'Vinamilk',
          currentPrice: 78300,
          targetPrice: 75000,
          condition: 'below',
          isActive: true,
          triggered: false,
          createdAt: '2023-08-02T14:45:00Z'
        },
        {
          id: 4,
          stockSymbol: 'HPG',
          stockName: 'Hoa Phat Group',
          currentPrice: 23400,
          targetPrice: 25000,
          condition: 'above',
          isActive: false,
          triggered: true,
          createdAt: '2023-07-25T11:20:00Z',
          triggeredAt: '2023-07-28T10:15:00Z'
        },
        {
          id: 5,
          stockSymbol: 'MSN',
          stockName: 'Masan Group',
          currentPrice: 65400,
          targetPrice: 60000,
          condition: 'below',
          isActive: false,
          triggered: true,
          createdAt: '2023-07-26T09:30:00Z',
          triggeredAt: '2023-07-30T14:22:00Z'
        }
      ];
      
      // Filter based on the requested filter type
      if (filter === 'all') {
        return sampleAlerts;
      } else if (filter === 'active') {
        return sampleAlerts.filter(alert => alert.isActive && !alert.triggered);
      } else if (filter === 'triggered') {
        return sampleAlerts.filter(alert => alert.triggered);
      }
      
      return sampleAlerts;
    }
  },

  /**
   * Create a new price alert
   */
  async createAlert(alertData) {
    try {
      const response = await axios.post(`${API_URL}/alerts`, alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      
      // For development, return sample data
      return {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID for demo
        stockSymbol: alertData.symbol,
        stockName: alertData.name,
        currentPrice: alertData.currentPrice,
        targetPrice: alertData.targetPrice,
        condition: alertData.condition,
        isActive: true,
        triggered: false,
        createdAt: new Date().toISOString()
      };
    }
  },

  /**
   * Update an alert
   */
  async updateAlert(id, alertData) {
    try {
      const response = await axios.put(`${API_URL}/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      console.error(`Error updating alert ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an alert
   */
  async deleteAlert(id) {
    try {
      await axios.delete(`${API_URL}/alerts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting alert ${id}:`, error);
      throw error;
    }
  }
};

export default alertService;
