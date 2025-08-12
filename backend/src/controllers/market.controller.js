const marketService = require('../services/market.service');

exports.getMarketIndices = async (req, res) => {
  try {
    const indices = await marketService.getMarketIndices();
    
    res.status(200).json({
      status: 'success',
      data: indices
    });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch market indices',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getExchangeData = async (req, res) => {
  const { exchange } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  
  try {
    const exchangeData = await marketService.getExchangeData(exchange, limit, offset);
    
    res.status(200).json({
      status: 'success',
      data: exchangeData
    });
  } catch (error) {
    console.error(`Error fetching data for exchange ${exchange}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch exchange data',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getGlobalIndices = async (req, res) => {
  try {
    const globalIndices = await marketService.getGlobalIndices();
    
    res.status(200).json({
      status: 'success',
      data: globalIndices
    });
  } catch (error) {
    console.error('Error fetching global indices:', error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch global indices',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getCryptoRates = async (req, res) => {
  const { limit = 10 } = req.query;
  
  try {
    const cryptoRates = await marketService.getCryptoRates(limit);
    
    res.status(200).json({
      status: 'success',
      data: cryptoRates
    });
  } catch (error) {
    console.error('Error fetching cryptocurrency rates:', error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch cryptocurrency rates',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getForexRates = async (req, res) => {
  const { base = 'USD', symbols = 'VND' } = req.query;
  
  try {
    const forexRates = await marketService.getForexRates(base, symbols);
    
    res.status(200).json({
      status: 'success',
      data: forexRates
    });
  } catch (error) {
    console.error('Error fetching forex rates:', error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch forex rates',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getMarketInsights = async (req, res) => {
  const { limit = 5 } = req.query;
  
  try {
    const insights = await marketService.getMarketInsights(limit);
    
    res.status(200).json({
      status: 'success',
      data: insights
    });
  } catch (error) {
    console.error('Error fetching market insights:', error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch market insights',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
