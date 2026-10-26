const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllReviews
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/reviews', getAllReviews);

module.exports = router;
