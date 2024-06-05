import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from './components/Header';
import './App.css';

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-arrow next"
      onClick={onClick}
    >
      &gt;
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="custom-arrow prev"
      onClick={onClick}
    >
      &lt;
    </div>
  );
};

function App() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/movies')
      .then((response) => {
        setMovies(response.data);
        const allReviews = response.data.flatMap((movie) => 
          movie.reviews.map((review) => ({
            ...review,
            movieTitle: movie.title,
            movieId: movie._id, // movieId 추가
            userName: review.username, // Assuming the username is part of the review
          }))
        );
        const sortedReviews = allReviews.sort((a, b) => b.likes - a.likes);
        setReviews(sortedReviews);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        alert('영화 정보를 불러오는 도중 오류가 발생했습니다.');
      });
  }, []);

  const handleLogin = (username, password) => {
    axios.post('http://localhost:5000/users/login', { username, password })
      .then(response => {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('로그인 도중 오류가 발생했습니다.');
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating) => {
    const goldStar = '★';
    const emptyStar = '';
    const filledStars = goldStar.repeat(rating);
    const emptyStars = emptyStar.repeat(5 - rating);
    return (
      <span style={{ color: 'gold' }}>
        {filledStars}
        {emptyStars}
      </span>
    );
  };

  const handleReviewClick = (movieId) => {
    window.location.href = `/movies/${movieId}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    spacing: 20,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className="App">
      <Header user={user} onLogin={handleLogin} />
      <div className="content">
        <h1>추천 리뷰</h1>
        <Slider {...settings} className="review-slider">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review"
              onClick={() => handleReviewClick(review.movieId)}
            >
              <p><strong>{review.movieTitle}</strong></p>
              <p><strong>별점:</strong> {renderStars(review.rating)}</p>
              <p>{review.review}</p>
            </div>
          ))}
        </Slider>
        <br />
        <h1>박스오피스 순위</h1>
        <div className="slider-container">
          <Slider {...settings} className="movie-slider">
            {movies.sort((a, b) => a.boxOfficeRank - b.boxOfficeRank).map((movie, index) => (
              <div key={movie._id} className="movie">
                <div className="poster-container">
                  <span className="box-office-rank">{index + 1}</span>
                  <div onClick={() => window.location.href = `/movies/${movie._id}`}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="poster-image"
                    />
                    <div className="info">
                      <h2>{movie.title}</h2>
                      <p>장르: {movie.genre}</p>
                      <p>제작: {movie.director}</p>
                      <p>출연: {movie.precast.join(', ')}</p>
                      <p>개봉일: {formatDate(movie.releaseDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default App;
