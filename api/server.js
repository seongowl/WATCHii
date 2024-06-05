// api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// User 모델 가져오기
const User = require('./models/User');

// Movie 모델 가져오기
const Movie = require('./models/Movie');

// Review 모델 가져오기
const Review = require('./models/Review');

// 설정된 저장소
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 중복 방지
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 엔드포인트
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: '파일 업로드 실패' });
  }
});

const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// 회원가입 엔드포인트
app.post('/signup', async (req, res) => {
  const { username, password, userinfo } = req.body;
  try {
    const newUser = new User({ username: username, password: password, userinfo: userinfo });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 로그인 엔드포인트
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // 사용자가 인증되면 JWT 토큰 생성
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // 토큰을 클라이언트에 반환
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message }); // 에러 메시지를 반환하도록 수정
  }
});

// 마이페이지 엔드포인트
app.get('/mypage', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId); // req.user에서 userId 가져오기
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // userinfo를 배열 안에 객체로 감싸서 전달
    res.json({ userinfo: [currentUser.userinfo] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 마이페이지 정보 업데이트 엔드포인트
app.put('/mypage', authMiddleware, async (req, res) => {
  const { userinfo } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // userinfo를 배열 안에 객체로 감싸서 업데이트
    user.userinfo = [userinfo];
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 업데이트된 마이페이지 엔드포인트
app.post('/users/mypage', authMiddleware, async (req, res) => {
  try {
    const updatedUserInfo = req.body.userinfo;
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { userinfo: updatedUserInfo },
      { new: true }
    );

    res.json({ userinfo: user.userinfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 리뷰 제공 엔드포인트
app.get('/movies/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id).populate('reviews.userId');
    if (movie) {
      res.json(movie.reviews);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/movies/:id/reviews', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { review, rating } = req.body;

  // 현재 로그인한 사용자의 정보를 요청에서 가져옴
  const userId = req.user.userId; // req.user.userId로 수정
  const username = req.user.username; // req.user.username으로 수정

  try {
    await Movie.findByIdAndUpdate(id, {
      $push: { 
        reviews: { 
          review: review, 
          rating: rating, 
          userId: userId, // 수정된 부분
          username: username // 수정된 부분
        } 
      },
    });    

    res.status(201).json({ message: 'Review created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// 검색 엔드포인트
app.get('/search/movies', async (req, res) => {
  const { query } = req.query;
  try {
    // 전체 영화를 검색하고 검색어와 일치하는 영화들을 찾습니다.
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { director: { $regex: query, $options: 'i' } },
        { cast: { $regex: query, $options: 'i' } },
        { releaseDate: { $regex: query, $options: 'i' } },
        { boxOfficeRank: { $regex: query, $options: 'i' } },
        { synopsis: { $regex: query, $options: 'i' } },
        { reviews: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 검색 기능
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const result = await db.collection('post')
      .find({ title: { $regex: searchQuery, $options: 'i' } }) // 'i' 옵션으로 대소문자 구분 없이 검색
      .toArray();
    res.json({ posts: result });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while searching');
  }
});

// 라우트 설정
app.use('/movies', movieRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});