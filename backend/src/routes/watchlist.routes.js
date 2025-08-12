const { Router } = require('express');
const watchlistController = require('../controllers/watchlist.controller');
const authController = require('../controllers/auth.controller');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = Router();

// All watchlist routes require authentication
router.use(authController.verifyToken);

// Get all watchlists for current user
router.get('/', watchlistController.getUserWatchlists);

// Create new watchlist
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Watchlist name is required'),
    validateRequest
  ],
  watchlistController.createWatchlist
);

// Get a specific watchlist
router.get(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid watchlist ID'),
    validateRequest
  ],
  watchlistController.getWatchlistById
);

// Update a watchlist
router.put(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid watchlist ID'),
    body('name').notEmpty().withMessage('Watchlist name is required'),
    validateRequest
  ],
  watchlistController.updateWatchlist
);

// Delete a watchlist
router.delete(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid watchlist ID'),
    validateRequest
  ],
  watchlistController.deleteWatchlist
);

// Add stock to watchlist
router.post(
  '/:id/stocks',
  [
    param('id').isNumeric().withMessage('Invalid watchlist ID'),
    body('symbol').notEmpty().withMessage('Stock symbol is required'),
    validateRequest
  ],
  watchlistController.addStockToWatchlist
);

// Remove stock from watchlist
router.delete(
  '/:id/stocks/:symbol',
  [
    param('id').isNumeric().withMessage('Invalid watchlist ID'),
    param('symbol').notEmpty().withMessage('Stock symbol is required'),
    validateRequest
  ],
  watchlistController.removeStockFromWatchlist
);

module.exports = router;
