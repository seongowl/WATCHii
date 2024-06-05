require('dotenv').config(); // dotenv 패키지 로드

const mongoose = require('mongoose');

// .env 파일에서 MongoDB 연결 문자열 가져오기
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const reviewSchema = new mongoose.Schema({
  user: String,
  content: String,
  likes: Number,
});

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  director: String,
  cast: [String],
  releaseDate: String,
  plot: String,
  boxOfficeRank: Number,
  posterUrl: String,
  reviews: [reviewSchema],
});

const Movie = mongoose.model('Movie', movieSchema);

const boxOfficeMovies = [ // sampleMovies를 boxOfficeMovies로 변경
  {
    title: '퓨리오사: 매드맥스 사가',
    genre: '액션/모험/SF',
    director: 'Director 1',
    cast: ['Actor 1', 'Actor 2'],
    releaseDate: '2023-01-01',
    plot: 'Plot 1',
    boxOfficeRank: 1,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [
      { user: 'User1', content: 'Great movie!', likes: 10 },
      { user: 'User2', content: 'Not bad', likes: 5 },
    ],
  },
  {
    title: '범죄도시4',
    genre: '범죄/액션',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 2',
    boxOfficeRank: 2,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '그녀가 죽었다',
    genre: '미스터리/스릴러',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 3',
    boxOfficeRank: 3,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '극장판 하이큐!! 쓰레기장의 결전',
    genre: '애니메이션/스포츠',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 4',
    boxOfficeRank: 4,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '청춘 18X2 너에게로 이어지는 길',
    genre: '드라마',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 5',
    boxOfficeRank: 5,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '혹성탈출: 새로운 시대',
    genre: '액션/SF',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 6',
    boxOfficeRank: 6,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '가필드 더 무비',
    genre: '액션/SF',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 7',
    boxOfficeRank: 7,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '이프: 상상의 친구',
    genre: '액션/SF',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 8',
    boxOfficeRank: 8,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '악마와의 토크쇼',
    genre: '액션/SF',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 9',
    boxOfficeRank: 9,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
  {
    title: '남은 인생 10년',
    genre: '드라마',
    director: 'Director 2',
    cast: ['Actor 3', 'Actor 4'],
    releaseDate: '2023-02-01',
    plot: 'Plot 10',
    boxOfficeRank: 10,
    posterUrl: 'https://example.com/poster1.jpg',
    reviews: [{ user: 'User3', content: 'Loved it', likes: 15 }],
  },
];

async function seedMovies() {
  try {
    await Movie.insertMany(boxOfficeMovies); // sampleMovies를 boxOfficeMovies로 변경
    console.log('Movie data successfully seeded!');
  } catch (error) {
    console.error('Error seeding movie data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedMovies();
