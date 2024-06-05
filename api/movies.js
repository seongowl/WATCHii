import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // 서버에서 영화 정보 가져오기
    axios.get('/movies')
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            <h2>{movie.title}</h2>
            <p>장르: {movie.genre}</p>
            <p>감독: {movie.director}</p>
            <p>출연 배우: {movie.precast.join(', ')}</p>
            <p>출연 배우: {movie.cast.join(', ')}</p>
            <p>개봉일: {movie.releaseDate}</p>
            <p>줄거리: {movie.plot}</p>
            <p><strong>박스오피스 순위:</strong> {movie.boxOfficeRank}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Movies;
