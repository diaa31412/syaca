const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const auth = require('../middleware/auth');

router.post('/subscribe', auth, subscriberController.createSubscription);
router.get('/my-subscriptions', auth, subscriberController.getUserSubscriptions);

module.exports = router;
