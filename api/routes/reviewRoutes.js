// // routes/reviewRoutes.js
// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviewController');
// const authMiddleware = require('../middleware/authMiddleware');

// router.get('/reviews', reviewController.getAllReviews);
// router.get('/:movieId', reviewController.getReviewsByMovieId);
// router.post('/:movieId', authMiddleware, reviewController.createReview);
// router.put('/:movieId/:reviewId', authMiddleware, reviewController.updateReview);
// router.delete('/:movieId/:reviewId', authMiddleware, reviewController.deleteReview);

// module.exports = router;

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/movies/:id/reviews', reviewController.getReviews);
router.post('/movies/:id/reviews', authMiddleware, reviewController.createReview);

module.exports = router;
