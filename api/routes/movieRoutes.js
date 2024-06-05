// // routes/movieRoutes.js
// const express = require('express');
// const router = express.Router();
// const movieController = require('../controllers/movieController');

// router.get('/', movieController.getAllMovies);
// router.get('/:id', movieController.getMovieById);
// router.get('/search', movieController.searchMovies);
// router.post('/', movieController.createMovie);
// router.put('/:id', movieController.updateMovie);
// router.delete('/:id', movieController.deleteMovie);

// module.exports = router;

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;

