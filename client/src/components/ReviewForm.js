import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ReviewForm.css';

const ReviewForm = ({ movieId }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingClick = (value) => {
    setRating(value); 
  };

  const handleSubmitReview = async () => {
    if (!review || !rating) { // 리뷰 또는 평점이 비어 있는 경우 알림을 표시하고 함수 종료
      toast.error('리뷰와 평점을 작성해주세요.');
      return;
    }
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post(`http://localhost:5000/movies/${movieId}/reviews`, { review, rating }, config);
      setReview('');
      setRating(0);
      setSubmittingReview(false);
      toast.success('리뷰 등록이 완료되었습니다.', { autoClose: 3000 }); // 성공 알림
    } catch (error) {
      console.error('리뷰 제출에 실패했습니다:', error);
      setReviewError(error.message);
      setSubmittingReview(false);
      toast.error(`리뷰 등록에 실패했습니다: ${error.message}`, { autoClose: 3000 }); // 실패 알림
    }
  };
  
  return (
    <div className="review-form">
      <h2>리뷰 작성</h2>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            style={{ color: rating >= value ? 'gold' : 'gray' }} 
            onClick={() => handleRatingClick(value)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={review}
        onChange={handleReviewChange}
        placeholder="리뷰를 작성하세요..."
        rows={4}
        cols={50}
        required // 리뷰는 필수 입력 사항임을 나타냅니다.
      />
      <button onClick={handleSubmitReview} disabled={submittingReview}>
        {submittingReview ? '제출 중...' : '리뷰 제출'}
      </button>
    </div>
  );
};

export default ReviewForm;
