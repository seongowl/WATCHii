import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import ReviewForm from '../components/ReviewForm';
import './MovieDetailPage.css';

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

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasReviews, setHasReviews] = useState(false); // 새로운 상태 추가

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('영화 정보를 불러오는 데 실패했습니다:', error);
        setError(error.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/movies/${id}/reviews`);
        setReviews(response.data);
        setHasReviews(response.data.length > 0); // 리뷰의 존재 여부 설정
      } catch (error) {
        console.error('리뷰 정보를 불러오는 데 실패했습니다:', error);
      }
    };

    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    fetchMovie();
    fetchReviews();
    checkAuth();
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>영화 정보를 불러오는 데 실패했습니다: {error}</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

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


  return (
    <div className="movie-detail">
      {movie && (
        <>
          <h1>{movie.title}</h1>
          <img src={movie.posterUrl} alt={movie.title} />
          <p><strong>장르:</strong> {movie.genre}</p>
          <p><strong>감독:</strong> {movie.director}</p>
          <p><strong>출연:</strong> {movie.cast.join(', ')}</p>
          <p><strong>개봉:</strong> {formatDate(movie.releaseDate)}</p>
          <p><strong>시놉시스:</strong> {movie.synopsis}</p>

          {movie.stills && (
            <Slider {...settings}>
              {movie.stills.map((still, index) => (
                <div key={index}>
                  <img src={still} alt={`Still ${index + 1}`} />
                </div>
              ))}
            </Slider>
          )}

          {isAuthenticated && <ReviewForm movieId={id} />}
          <h2>리뷰</h2>
          {hasReviews ? ( // 리뷰가 있는 경우에만 표시
            <ul>
              {reviews.map((review, index) => (
                <div key={index} className="review">
                  <p><strong>{review.username}</strong></p><p><strong>별점:</strong> {renderStars(review.rating)}</p>
                  <p>{review.review}</p>
                </div>
              ))}
            </ul>
          ) : (
            <p>작성된 리뷰가 없습니다.</p> // 리뷰가 없는 경우에도 표시
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetailPage;
