const { Router } = require('express');
const marketController = require('../controllers/market.controller');

const router = Router();

// Get market indices
router.get('/indices', marketController.getMarketIndices);

// Get exchange data (HNX, HOSE, etc.)
router.get('/exchanges/:exchange', marketController.getExchangeData);

// Get global indices
router.get('/global', marketController.getGlobalIndices);

// Get cryptocurrency rates
router.get('/crypto', marketController.getCryptoRates);

// Get forex rates (USD/VND)
router.get('/forex', marketController.getForexRates);

// Get market insights/news
router.get('/insights', marketController.getMarketInsights);

module.exports = router;
