// index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import MovieDetailPage from './pages/MovieDetailPage';
import MyPage from './pages/Mypage';
import SearchResultPage from './pages/SearchResultPage';
import ReviewForm from './components/ReviewForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <Router>
    <ToastContainer />
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/movies/:id" element={<MovieDetailPage />} />
      <Route exact path="/reviews" element={<ReviewForm />} />
      <Route exact path="/Mypage" element={<MyPage />} />
      <Route exact path="/search" element={<SearchResultPage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
