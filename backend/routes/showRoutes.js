const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  updateShow,
  deleteShow
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.get('/:id/seats', getShowSeats);

router.route('/:id')
  .get(getShowById)
  .put(protect, admin, updateShow)
  .delete(protect, admin, deleteShow);

module.exports = router;
