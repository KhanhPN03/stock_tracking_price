const { Router } = require('express');
const authRoutes = require('./auth.routes');
const stockRoutes = require('./stock.routes');
const watchlistRoutes = require('./watchlist.routes');
const alertRoutes = require('./alert.routes');
const marketRoutes = require('./market.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);
router.use('/watchlists', watchlistRoutes);
router.use('/alerts', alertRoutes);
router.use('/market', marketRoutes);

module.exports = router;
