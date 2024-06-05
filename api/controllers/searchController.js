// // api/controllers/searchController.js

// const Movie = require('../models/Movie');
// const { format } = require('date-fns');

// // 검색 엔드포인트를 처리하는 컨트롤러 메서드
// exports.searchMovies = async (req, res) => {
//   const { query } = req.query;
//   try {
//     // 전체 영화를 검색하고 검색어와 일치하는 영화들을 찾습니다.
//     const movies = await Movie.find({
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { genre: { $regex: query, $options: 'i' } },
//         { director: { $regex: query, $options: 'i' } },
//         { cast: { $regex: query, $options: 'i' } },
//         { releaseDate: { $regex: query, $options: 'i' } },
//         { boxOfficeRank: { $regex: query, $options: 'i' } },
//         { synopsis: { $regex: query, $options: 'i' } },
//         { reviews: { $regex: query, $options: 'i' } },
//       ],
//     });
//     const formattedMovies = movies.map(movie => ({
//       ...movie._doc,
//       releaseDate: format(new Date(movie.releaseDate), 'yyyy-MM-dd'),
//     }));
//     res.json(formattedMovies);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 검색 기능을 처리하는 컨트롤러 메서드
// exports.searchPosts = async (req, res) => {
//   try {
//     const searchQuery = req.query.query;
//     const result = await db.collection('post')
//       .find({ title: { $regex: searchQuery, $options: 'i' } }) // 'i' 옵션으로 대소문자 구분 없이 검색
//       .toArray();
//     res.json({ posts: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error occurred while searching');
//   }
// };


const Movie = require('../models/Movie');

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  try {
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } },
        { cast: { $regex: query, $options: 'i' } },
        { releaseDate: { $regex: query, $options: 'i' } },
        { boxOfficeRank: { $regex: query, $options: 'i' } },
        { synopsis: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const result = await db.collection('post')
      .find({ title: { $regex: searchQuery, $options: 'i' } })
      .toArray();
    res.json({ posts: result });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while searching');
  }
};
