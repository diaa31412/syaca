const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Public routes
router.get('/', cardController.getAllCards);
router.get('/:id', cardController.getCardById);
router.get('/number/:cardNumber', cardController.getCardByNumber);

// Admin-only routes
router.post('/', authMiddleware, roleMiddleware('admin'), cardController.createCard);
router.put('/:id/status', authMiddleware, roleMiddleware('admin'), cardController.updateCardStatus);
router.put('/number/:cardNumber/deactivate', authMiddleware, cardController.deactivateCard); // Make sure this is properly defined
router.delete('/:id', authMiddleware, roleMiddleware('admin'), cardController.deleteCard);

module.exports = router;