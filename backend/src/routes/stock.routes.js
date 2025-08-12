const { Router } = require('express');
const stockController = require('../controllers/stock.controller');
const authController = require('../controllers/auth.controller');

const router = Router();

// Search stocks (must be before the symbol routes to avoid conflict)
router.get('/search/:query', stockController.searchStocks);

// Get stock data by symbol
router.get('/:symbol', stockController.getStockBySymbol);

// Get stock price history
router.get('/:symbol/history', stockController.getStockHistory);

// Get stock fundamentals
router.get('/:symbol/fundamentals', stockController.getStockFundamentals);

// Get company announcements
router.get('/:symbol/announcements', stockController.getCompanyAnnouncements);

// Get financial reports
router.get('/:symbol/financials', stockController.getFinancialReports);

module.exports = router;
