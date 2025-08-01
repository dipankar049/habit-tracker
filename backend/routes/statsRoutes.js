const express = require('express');
const router = express.Router();
const { getUserStats, getUserStreaks, getLevelAndXP } = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getUserStats);
router.get('/streaks', auth, getUserStreaks);
router.get('/level', auth, getLevelAndXP);

module.exports = router;