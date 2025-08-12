const stockService = require('../services/stock.service');

exports.getStockBySymbol = async (req, res) => {
  const { symbol } = req.params;
  
  try {
    const stockData = await stockService.getStockQuote(symbol);
    
    res.status(200).json({
      status: 'success',
      data: stockData
    });
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch stock data',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getStockHistory = async (req, res) => {
  const { symbol } = req.params;
  const { period = '1y', interval = '1d' } = req.query;
  
  try {
    const historyData = await stockService.getStockHistory(symbol, period, interval);
    
    res.status(200).json({
      status: 'success',
      data: historyData
    });
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch stock history',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getStockFundamentals = async (req, res) => {
  const { symbol } = req.params;
  
  try {
    const fundamentalData = await stockService.getStockFundamentals(symbol);
    
    res.status(200).json({
      status: 'success',
      data: fundamentalData
    });
  } catch (error) {
    console.error(`Error fetching fundamentals for ${symbol}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch fundamentals data',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getCompanyAnnouncements = async (req, res) => {
  const { symbol } = req.params;
  const { limit = 10, offset = 0 } = req.query;
  
  try {
    const announcements = await stockService.getCompanyAnnouncements(symbol, limit, offset);
    
    res.status(200).json({
      status: 'success',
      data: announcements
    });
  } catch (error) {
    console.error(`Error fetching announcements for ${symbol}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch company announcements',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getFinancialReports = async (req, res) => {
  const { symbol } = req.params;
  const { type = 'quarterly', limit = 4 } = req.query;
  
  try {
    const reports = await stockService.getFinancialReports(symbol, type, limit);
    
    res.status(200).json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    console.error(`Error fetching financial reports for ${symbol}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to fetch financial reports',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.searchStocks = async (req, res) => {
  const { query } = req.params;
  
  try {
    const searchResults = await stockService.searchStocks(query);
    
    res.status(200).json({
      status: 'success',
      data: searchResults
    });
  } catch (error) {
    console.error(`Error searching stocks with query ${query}:`, error);
    res.status(error.status || 500).json({
      status: 'error',
      message: error.message || 'Failed to search stocks',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
