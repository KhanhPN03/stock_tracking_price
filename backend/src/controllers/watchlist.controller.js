const { Watchlist, WatchlistStock, User } = require('../models');
const stockService = require('../services/stock.service');

exports.getUserWatchlists = async (req, res) => {
  try {
    const watchlists = await Watchlist.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: WatchlistStock,
          as: 'stocks',
          attributes: ['symbol', 'addedAt', 'notes']
        }
      ]
    });
    
    res.status(200).json({
      status: 'success',
      data: watchlists
    });
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch watchlists',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getWatchlistById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const watchlist = await Watchlist.findOne({
      where: { id, userId: req.userId },
      include: [
        {
          model: WatchlistStock,
          as: 'stocks',
          attributes: ['id', 'symbol', 'addedAt', 'notes']
        }
      ]
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }
    
    // Get current prices for all stocks in watchlist
    const stockSymbols = watchlist.stocks.map(stock => stock.symbol);
    
    if (stockSymbols.length > 0) {
      const stockPrices = await Promise.all(
        stockSymbols.map(symbol => stockService.getStockQuote(symbol))
      );
      
      // Add price data to watchlist stocks
      const stocksWithPrices = watchlist.stocks.map((stock, index) => ({
        ...stock.toJSON(),
        currentPrice: stockPrices[index]?.close || null,
        priceChange: stockPrices[index]?.change || null,
        priceChangePercent: stockPrices[index]?.change_p || null
      }));
      
      watchlist.dataValues.stocks = stocksWithPrices;
    }
    
    res.status(200).json({
      status: 'success',
      data: watchlist
    });
  } catch (error) {
    console.error(`Error fetching watchlist ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createWatchlist = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const watchlist = await Watchlist.create({
      name,
      description,
      userId: req.userId
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Watchlist created successfully',
      data: watchlist
    });
  } catch (error) {
    console.error('Error creating watchlist:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateWatchlist = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  try {
    const watchlist = await Watchlist.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }
    
    // Update watchlist
    await watchlist.update({
      name: name || watchlist.name,
      description: description !== undefined ? description : watchlist.description
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Watchlist updated successfully',
      data: watchlist
    });
  } catch (error) {
    console.error(`Error updating watchlist ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteWatchlist = async (req, res) => {
  const { id } = req.params;
  
  try {
    const watchlist = await Watchlist.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }
    
    // Delete all associated stocks first
    await WatchlistStock.destroy({
      where: { watchlistId: id }
    });
    
    // Delete the watchlist
    await watchlist.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'Watchlist deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting watchlist ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.addStockToWatchlist = async (req, res) => {
  const { id } = req.params;
  const { symbol, notes } = req.body;
  
  try {
    const watchlist = await Watchlist.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }
    
    // Verify that the stock symbol exists
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
    
    // Check if stock already exists in watchlist
    const existingStock = await WatchlistStock.findOne({
      where: { watchlistId: id, symbol }
    });
    
    if (existingStock) {
      return res.status(400).json({
        status: 'error',
        message: 'Stock already exists in watchlist'
      });
    }
    
    // Add stock to watchlist
    const watchlistStock = await WatchlistStock.create({
      watchlistId: id,
      symbol,
      notes
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Stock added to watchlist',
      data: watchlistStock
    });
  } catch (error) {
    console.error(`Error adding stock to watchlist ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add stock to watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.removeStockFromWatchlist = async (req, res) => {
  const { id, symbol } = req.params;
  
  try {
    const watchlist = await Watchlist.findOne({
      where: { id, userId: req.userId }
    });
    
    if (!watchlist) {
      return res.status(404).json({
        status: 'error',
        message: 'Watchlist not found'
      });
    }
    
    // Delete the stock from watchlist
    const deleted = await WatchlistStock.destroy({
      where: { watchlistId: id, symbol }
    });
    
    if (deleted === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Stock not found in watchlist'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Stock removed from watchlist'
    });
  } catch (error) {
    console.error(`Error removing stock from watchlist ${id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove stock from watchlist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
