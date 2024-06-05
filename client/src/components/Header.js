import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Header.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [signupStatus, setSignupStatus] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);
  const [showInputWarning, setShowInputWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (signupStatus === true) {
      setTimeout(() => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
      }, 1000); // 1초 후에 로그인 모달 열기
    }
  }, [signupStatus]);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
    setSignupStatus(null);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginStatus(null);
  };

  const handleSignup = (username, password) => {
    axios.post('http://localhost:5000/signup', { username, password })
      .then((response) => {
        // 회원가입 성공 시
        toast.success("회원가입이 성공적으로 완료되었습니다.");
        setSignupStatus(true);
      })
      .catch((error) => {
        // 회원가입 실패 시
        toast.error("회원가입에 실패했습니다. 다시 시도해주세요.");
        setSignupStatus(false);
      });
  };

  const handleLogin = (username, password) => {
    axios.post('http://localhost:5000/login', { username, password })
      .then((response) => {
        // 로그인 성공 시
        toast.success("로그인이 성공적으로 완료되었습니다.");
        localStorage.setItem('token', response.data.token);
        setLoginStatus(true);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false); // 로그인 성공 시에만 모달 닫기
      })
      .catch((error) => {
        // 로그인 실패 시
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
        setLoginStatus(false);
        // 모달 창을 닫지 않고 그대로 유지
      });
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // 로그아웃 성공 시
    toast.success("로그아웃이 성공적으로 완료되었습니다.");
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setShowInputWarning(true);
    } else {
      navigate(`/movies/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navigateToMyPage = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <div className="logo">WATCHii</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="영화를 검색하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search" // 여기에 className 추가
        />
        <button type="button" className="search-send" onClick={handleSearch}>검색</button> {/* 검색 버튼에 onClick 이벤트 추가 */}
        {showInputWarning && <p style={{ color: 'red' }}>검색어를 입력하세요.</p>}
      </div>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <button type="button" onClick={navigateToMyPage}>마이페이지</button>
            <button type="button" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button type="button" onClick={openSignupModal}>회원가입</button>
            <button type="button" onClick={openLoginModal}>로그인</button>
          </>
        )}
      </div>
      <Modal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        title="회원가입"
        className="auth-buttons"
        onSubmit={handleSignup}
        statusMessage={signupStatus !== null ? (signupStatus ? "회원가입이 성공적으로 완료되었습니다." : "회원가입에 실패했습니다. 다시 시도해주세요.") : null}
      />
      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title="로그인"
        className="auth-buttons"
        onSubmit={handleLogin}
        statusMessage={loginStatus !== null ? (loginStatus ? "로그인이 성공적으로 완료되었습니다." : "로그인에 실패했습니다. 다시 시도해주세요.") : null}
      />
    </header>
  );
};

export default Header;
