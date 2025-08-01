const express = require('express');
const router = express.Router();
const { getRandomQuote } = require('../controllers/quoteController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getRandomQuote);

module.exports = router;