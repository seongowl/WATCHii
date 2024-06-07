import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResultPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_PROFILE_URL+`/movies/search?query=${encodeURIComponent(query)}`);
        setResults(response.data.posts);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <h1>검색결과</h1>
      {results.length > 0 ? (
        results.map((post) => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.genre}</p>
          </div>
        ))
      ) : (
        <p>검색 결과를 찾을 수 없습니다...</p>
      )}
    </div>
  );
};

export default SearchResultPage;
