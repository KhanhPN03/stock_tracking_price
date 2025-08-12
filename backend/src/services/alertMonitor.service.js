const cron = require('node-cron');
const { Alert, User } = require('../models');
const stockService = require('./stock.service');
const emailService = require('./email.service');
const WebSocket = require('ws');
const apiConfig = require('../config/api');

// Service for monitoring price alerts
const alertMonitorService = {
  // Initialize WebSocket connection for real-time price updates
  websocket: null,
  activeSymbols: new Set(),
  symbolPrices: {},
  isWsConnected: false,
  
  // Start the alert monitoring service
  async start() {
    console.log('Starting price alert monitoring service...');
    
    // First run using cron job for periodic checks
    this.scheduleCronJob();
    
    // Then try to set up WebSocket for real-time updates
    await this.setupWebSocket();
  },
  
  // Schedule a cron job to check price alerts every 15 minutes
  scheduleCronJob() {
    console.log('Setting up cron job for price alerts...');
    
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      console.log('Running price alert check (cron)...');
      await this.checkAllAlerts();
    });
    
    // Also run it once at startup
    this.checkAllAlerts();
  },
  
  // Set up WebSocket connection for real-time price updates
  async setupWebSocket() {
    try {
      // Get all active symbols to monitor
      await this.updateActiveSymbols();
      
      if (this.activeSymbols.size === 0) {
        console.log('No active symbols to monitor via WebSocket');
        return;
      }
      
      // Connect to Twelve Data WebSocket API
      this.websocket = new WebSocket(apiConfig.twelveData.websocketUrl);
      
      this.websocket.on('open', () => {
        console.log('WebSocket connection established');
        this.isWsConnected = true;
        
        // Subscribe to price updates for all active symbols
        const symbols = Array.from(this.activeSymbols);
        this.websocket.send(JSON.stringify({
          action: 'subscribe',
          params: {
            symbols: symbols.join(','),
            events: ['price']
          },
          api_key: apiConfig.twelveData.apiKey
        }));
        
        console.log(`Subscribed to price updates for ${symbols.length} symbols`);
      });
      
      this.websocket.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          
          if (message.event === 'price') {
            const { symbol, price } = message;
            
            // Update price in memory
            this.symbolPrices[symbol] = parseFloat(price);
            
            // Check alerts for this symbol
            await this.checkAlertsForSymbol(symbol, parseFloat(price));
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });
      
      this.websocket.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.isWsConnected = false;
        
        // Retry connection after 5 minutes
        setTimeout(() => this.setupWebSocket(), 5 * 60 * 1000);
      });
      
      this.websocket.on('close', () => {
        console.log('WebSocket connection closed');
        this.isWsConnected = false;
        
        // Retry connection after 1 minute
        setTimeout(() => this.setupWebSocket(), 60 * 1000);
      });
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
  },
  
  // Update the list of active symbols to monitor
  async updateActiveSymbols() {
    try {
      // Get all active alerts
      const activeAlerts = await Alert.findAll({
        where: { active: true, triggered: false }
      });
      
      // Extract unique symbols
      this.activeSymbols = new Set(activeAlerts.map(alert => alert.symbol));
      
      console.log(`Updated active symbols: ${Array.from(this.activeSymbols).join(', ')}`);
      
      // If WebSocket is already connected, update subscriptions
      if (this.isWsConnected && this.websocket) {
        const symbols = Array.from(this.activeSymbols);
        
        // First unsubscribe from all
        this.websocket.send(JSON.stringify({
          action: 'unsubscribe',
          params: {
            events: ['price']
          },
          api_key: apiConfig.twelveData.apiKey
        }));
        
        // Then subscribe to current active symbols
        if (symbols.length > 0) {
          this.websocket.send(JSON.stringify({
            action: 'subscribe',
            params: {
              symbols: symbols.join(','),
              events: ['price']
            },
            api_key: apiConfig.twelveData.apiKey
          }));
        }
      }
    } catch (error) {
      console.error('Error updating active symbols:', error);
    }
  },
  
  // Check all active price alerts
  async checkAllAlerts() {
    try {
      // Get all active alerts
      const activeAlerts = await Alert.findAll({
        where: { active: true, triggered: false }
      });
      
      if (activeAlerts.length === 0) {
        console.log('No active alerts to check');
        return;
      }
      
      console.log(`Checking ${activeAlerts.length} active alerts...`);
      
      // Group alerts by symbol to minimize API calls
      const alertsBySymbol = {};
      activeAlerts.forEach(alert => {
        if (!alertsBySymbol[alert.symbol]) {
          alertsBySymbol[alert.symbol] = [];
        }
        alertsBySymbol[alert.symbol].push(alert);
      });
      
      // Check each symbol
      for (const symbol of Object.keys(alertsBySymbol)) {
        try {
          const stockData = await stockService.getStockQuote(symbol);
          const currentPrice = stockData.close || stockData.previousClose || 0;
          
          // Update price in memory
          this.symbolPrices[symbol] = currentPrice;
          
          // Check all alerts for this symbol
          for (const alert of alertsBySymbol[symbol]) {
            await this.checkAlert(alert, currentPrice);
          }
        } catch (error) {
          console.error(`Error checking alerts for symbol ${symbol}:`, error);
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  },
  
  // Check alerts for a specific symbol
  async checkAlertsForSymbol(symbol, currentPrice) {
    try {
      const alerts = await Alert.findAll({
        where: {
          symbol,
          active: true,
          triggered: false
        }
      });
      
      console.log(`Checking ${alerts.length} alerts for symbol ${symbol} at price ${currentPrice}`);
      
      for (const alert of alerts) {
        await this.checkAlert(alert, currentPrice);
      }
    } catch (error) {
      console.error(`Error checking alerts for symbol ${symbol}:`, error);
    }
  },
  
  // Check a single alert
  async checkAlert(alert, currentPrice) {
    try {
      let isTriggered = false;
      
      // Check if alert condition is met
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        isTriggered = true;
      }
      
      if (isTriggered) {
        console.log(`Alert triggered for ${alert.symbol} (${alert.condition} ${alert.targetPrice}, current: ${currentPrice})`);
        
        // Update alert in database
        await alert.update({
          triggered: true,
          triggeredAt: new Date(),
          currentPrice
        });
        
        // Send notification
        const notificationSent = await emailService.sendPriceAlertNotification(alert);
        
        // Update notification status
        await alert.update({
          notificationSent
        });
        
        // Remove from active symbols if no more alerts for this symbol
        const activeAlertsForSymbol = await Alert.count({
          where: {
            symbol: alert.symbol,
            active: true,
            triggered: false
          }
        });
        
        if (activeAlertsForSymbol === 0) {
          this.activeSymbols.delete(alert.symbol);
          await this.updateActiveSymbols();
        }
      }
    } catch (error) {
      console.error(`Error checking alert ${alert.id}:`, error);
    }
  }
};

module.exports = alertMonitorService;
