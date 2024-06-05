// // controllers/reviewController.js
// const Movie = require('../models/Movie');

// // 모든 영화의 리뷰를 조회하는 컨트롤러
// exports.getAllReviews = async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     const allReviews = movies.reduce((acc, movie) => {
//       return acc.concat(movie.reviews);
//     }, []);
//     res.json(allReviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 특정 영화의 리뷰를 조회하는 컨트롤러
// exports.getReviewsByMovieId = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.movieId);
//     if (movie) {
//       res.json(movie.reviews);
//     } else {
//       res.status(404).json({ message: 'Movie not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 새로운 리뷰를 생성하는 컨트롤러
// exports.createReview = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.movieId);
//     if (!movie) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
//     const review = {
//       user: req.user.id,
//       review: req.body.review,
//       rating: req.body.rating,
//       createdAt: new Date(),
//     };
//     movie.reviews.push(review);
//     await movie.save();
//     res.status(201).json(review);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 리뷰를 수정하는 컨트롤러
// exports.updateReview = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.movieId);
//     if (!movie) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
//     const review = movie.reviews.id(req.params.reviewId);
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
//     if (review.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'User not authorized to update this review' });
//     }
//     review.review = req.body.review || review.review;
//     review.rating = req.body.rating || review.rating;
//     await movie.save();
//     res.json(review);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 리뷰를 삭제하는 컨트롤러
// exports.deleteReview = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.movieId);
//     if (!movie) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
//     const review = movie.reviews.id(req.params.reviewId);
//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
//     if (review.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'User not authorized to delete this review' });
//     }
//     review.remove();
//     await movie.save();
//     res.json({ message: 'Review deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Movie = require('../models/Movie');

exports.getReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (movie) {
      res.json(movie.reviews);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;

  try {
    await Movie.findByIdAndUpdate(id, {
      $push: { reviews: { review: review, rating: rating } },
    });

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
