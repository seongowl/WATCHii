// const { format } = require('date-fns');
// const Movie = require('../models/Movie');

// // 모든 영화를 조회하는 컨트롤러
// exports.getAllMovies = async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     const formattedMovies = movies.map(movie => ({
//       ...movie._doc,
//       releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
//     }));
//     res.json(formattedMovies);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 특정 영화를 조회하는 컨트롤러
// exports.getMovieById = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (movie) {
//       res.json({
//         ...movie._doc,
//         releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
//       });
//     } else {
//       res.status(404).json({ message: 'Movie not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 검색 기능을 처리하는 컨트롤러 메서드
// exports.searchMovies = async (req, res) => {
//   console.log("searchIn");
//   try {
//     const query = req.query.query;
//     const movies = await Movie.find({
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { genre: { $regex: query, $options: 'i' } },
//         { director: { $regex: query, $options: 'i' } },
//         { cast: { $regex: query, $options: 'i' } },
//         { releaseDate: { $regex: query, $options: 'i' } },
//         { boxOfficeRank: { $regex: query, $options: 'i' } },
//         { synopsis: { $regex: query, $options: 'i' } },
//       ],
//     });
//     const formattedMovies = movies.map(movie => ({
//       ...movie._doc,
//       releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
//     }));
//     res.json(formattedMovies);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 새로운 영화를 생성하는 컨트롤러
// exports.createMovie = async (req, res) => {
//   const movieData = req.body;

//   const movie = new Movie({
//     title: movieData.title,
//     genre: movieData.genre,
//     director: movieData.director,
//     precast: movieData.precast,
//     cast: movieData.cast,
//     releaseDate: movieData.releaseDate,
//     boxOfficeRank: movieData.boxOfficeRank,
//     posterUrl: movieData.posterUrl,
//     synopsis: movieData.synopsis,
//     stills: movieData.stills,
//   });

//   try {
//     const newMovie = await movie.save();
//     res.status(201).json({
//       ...newMovie._doc,
//       releaseDate: format(new Date(newMovie.releaseDate), 'yyyy-MM-dd'),
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // 특정 영화를 수정하는 컨트롤러
// exports.updateMovie = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (movie) {
//       movie.title = req.body.title || movie.title;
//       movie.genre = req.body.genre || movie.genre;
//       movie.director = req.body.director || movie.director;
//       movie.precast = req.body.precast || movie.precast;
//       movie.cast = req.body.cast || movie.cast;
//       movie.releaseDate = req.body.releaseDate || movie.releaseDate;
//       movie.boxOfficeRank = req.body.boxOfficeRank || movie.boxOfficeRank;
//       movie.synopsis = req.body.synopsis || movie.synopsis;
//       movie.stills = req.body.stills || movie.stills;

//       const updatedMovie = await movie.save();
//       res.json({
//         ...updatedMovie._doc,
//         releaseDate: format(new Date(updatedMovie.releaseDate), 'yyyy-MM-dd'),
//       });
//     } else {
//       res.status(404).json({ message: 'Movie not found' });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // 특정 영화를 삭제하는 컨트롤러
// exports.deleteMovie = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (movie) {
//       await movie.remove();
//       res.json({ message: 'Movie deleted' });
//     } else {
//       res.status(404).json({ message: 'Movie not found' });
//     }
//   } catch (
//     error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   // 영화 상세페이지에서 리뷰 조회
//   exports.getReview = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const movie = await Movie.findById(id);
//     if (movie) {
//       res.json(movie.reviews);
//     } else {
//       res.status(404).send('Movie not found');
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//   // 영화 상세페이지에서 리뷰 작성
//   exports.createReview = async (req, res) => {
//     const { id } = req.params;
//     const { review, rating } = req.body;
  
//     try {
//       await Movie.findByIdAndUpdate(id, {
//         $push: { reviews: { review: review, rating: rating } },
//       });    
  
//       res.status(201).json({ message: 'Review created successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

const { format } = require('date-fns');
const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    const formattedMovies = movies.map(movie => ({
      ...movie._doc,
      releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
    }));
    res.json(formattedMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json({
        ...movie._doc,
        releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
      });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMovie = async (req, res) => {
  const movieData = req.body;
  const movie = new Movie(movieData);

  try {
    const newMovie = await movie.save();
    res.status(201).json({
      ...newMovie._doc,
      releaseDate: format(new Date(newMovie.releaseDate), 'yyyy-MM-dd'),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      Object.assign(movie, req.body);
      const updatedMovie = await movie.save();
      res.json({
        ...updatedMovie._doc,
        releaseDate: format(new Date(updatedMovie.releaseDate), 'yyyy-MM-dd'),
      });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      await movie.remove();
      res.json({ message: 'Movie deleted' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
