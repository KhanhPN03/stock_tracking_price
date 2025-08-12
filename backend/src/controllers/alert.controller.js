const { Alert } = require('../models');
const stockService = require('../services/stock.service');
const emailService = require('../services/email.service');

exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      status: 'success',
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getAlertById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const alert = await Alert.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!alert) {
      return res.status(404).json({
        status: 'error',
        message: 'Alert not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: alert
    });
  } catch (error) {
    console.error(`Error fetching alert ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alert',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createAlert = async (req, res) => {
  const { symbol, targetPrice, condition } = req.body;
  
  try {
    // Verify that the stock symbol exists and get current price
    let stockData;
    try {
      stockData = await stockService.getStockQuote(symbol);
      if (!stockData) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid stock symbol'
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid stock symbol or API error'
      });
    }
    
    // Create alert
    const alert = await Alert.create({
      userId: req.userId,
      symbol,
      targetPrice,
      currentPrice: stockData.close || stockData.previousClose || 0,
      condition,
      active: true
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Price alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create alert',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateAlert = async (req, res) => {
  const { id } = req.params;
  const { symbol, targetPrice, condition, active } = req.body;
  
  try {
    const alert = await Alert.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!alert) {
      return res.status(404).json({
        status: 'error',
        message: 'Alert not found'
      });
    }
    
    // Check if symbol is being updated
    if (symbol && symbol !== alert.symbol) {
      // Verify that the new stock symbol exists
      try {
        const stockData = await stockService.getStockQuote(symbol);
        if (!stockData) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid stock symbol'
          });
        }
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid stock symbol or API error'
        });
      }
    }
    
    // Update alert
    const updatedAlert = await alert.update({
      symbol: symbol || alert.symbol,
      targetPrice: targetPrice !== undefined ? targetPrice : alert.targetPrice,
      condition: condition || alert.condition,
      active: active !== undefined ? active : alert.active,
      // If alert was previously triggered but now has new criteria, reset trigger status
      triggered: (targetPrice !== undefined || condition !== undefined) ? false : alert.triggered,
      triggeredAt: (targetPrice !== undefined || condition !== undefined) ? null : alert.triggeredAt,
      notificationSent: (targetPrice !== undefined || condition !== undefined) ? false : alert.notificationSent
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Alert updated successfully',
      data: updatedAlert
    });
  } catch (error) {
    console.error(`Error updating alert ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update alert',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteAlert = async (req, res) => {
  const { id } = req.params;
  
  try {
    const alert = await Alert.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!alert) {
      return res.status(404).json({
        status: 'error',
        message: 'Alert not found'
      });
    }
    
    // Delete the alert
    await alert.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting alert ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete alert',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
