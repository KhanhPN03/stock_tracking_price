const { Router } = require('express');
const alertController = require('../controllers/alert.controller');
const authController = require('../controllers/auth.controller');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = Router();

// All alert routes require authentication
router.use(authController.verifyToken);

// Get all alerts for current user
router.get('/', alertController.getUserAlerts);

// Create new price alert
router.post(
  '/',
  [
    body('symbol').notEmpty().withMessage('Stock symbol is required'),
    body('targetPrice').isNumeric().withMessage('Target price must be a number'),
    body('condition').isIn(['above', 'below']).withMessage('Condition must be either "above" or "below"'),
    validateRequest
  ],
  alertController.createAlert
);

// Get a specific alert
router.get(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid alert ID'),
    validateRequest
  ],
  alertController.getAlertById
);

// Update an alert
router.put(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid alert ID'),
    body('symbol').optional().notEmpty().withMessage('Stock symbol is required'),
    body('targetPrice').optional().isNumeric().withMessage('Target price must be a number'),
    body('condition').optional().isIn(['above', 'below']).withMessage('Condition must be either "above" or "below"'),
    body('active').optional().isBoolean().withMessage('Active must be a boolean'),
    validateRequest
  ],
  alertController.updateAlert
);

// Delete an alert
router.delete(
  '/:id',
  [
    param('id').isNumeric().withMessage('Invalid alert ID'),
    validateRequest
  ],
  alertController.deleteAlert
);

module.exports = router;
