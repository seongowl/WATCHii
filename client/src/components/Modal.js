// Modal 컴포넌트 수정
import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, className, onSubmit, statusMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(username, password);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal">
            <button className="close-button" onClick={onClose}>X</button>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="사용자명"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button type="submit" className={className} disabled={submitting}>
                {submitting ? '처리 중...' : '확인'}
              </button>
            </form>
            {statusMessage && <div className="status-message">{statusMessage}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
