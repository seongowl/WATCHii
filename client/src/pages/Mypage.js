import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Mypage.css';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    profileImageURL: '',
    nickname: '',
    introduction: '',
    followers: '',
    following: '',
    favoriteGenres: '',
    likes: '',
    reviews: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('토큰이 없습니다.');
      return;
    }

    // 이전에 로컬 스토리지에 저장된 사용자 정보 가져오기
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setLoading(false);
    } else {
      axios.get('http://localhost:5000/mypage', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const fetchedUserInfo = response.data.userinfo[0];
        setUserInfo(fetchedUserInfo);
        setLoading(false);
        // 가져온 정보를 로컬 스토리지에 저장
        localStorage.setItem('userInfo', JSON.stringify(fetchedUserInfo));
      })
      .catch((error) => {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error);
        setLoading(false);
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 팔로워 수와 팔로잉 수는 무시하도록 수정
    if (name !== "followers" && name !== "following") {
      setUserInfo({
        ...userInfo,
        [name]: value
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
  
    // 필수 입력 필드들이 모두 채워져 있는지 확인
    if (!userInfo.nickname || !userInfo.introduction || !userInfo.favoriteGenres || !userInfo.likes) {
      toast.error('모든 필수 입력 필드를 채워주세요.');
      return;
    }
  
    // 이미지 파일이 업로드되었는지 확인
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl;
  
        // 업로드된 이미지 URL을 userInfo에 저장
        setUserInfo({ ...userInfo, profileImageURL: imageUrl });
  
        // 프로필 정보를 서버에 업데이트
        updateUserInfo(token, { ...userInfo, profileImageURL: imageUrl });
      })
      .catch((error) => {
        console.error('파일 업로드에 실패했습니다:', error);
      });
    } else {
      // 이미지가 업로드되지 않은 경우 프로필 정보만 서버에 업데이트
      updateUserInfo(token);
    }
  };
    
  const updateUserInfo = (token, updatedInfo = userInfo) => {
    axios.put('http://localhost:5000/mypage', { userinfo: updatedInfo }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
      // 로컬 스토리지에 업데이트된 userInfo 저장
      localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
      // 수정된 정보를 다시 로드
      setUserInfo(updatedInfo);
    })
    .catch((error) => {
      toast.error('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
      console.error('프로필 업데이트에 실패했습니다:', error);
    });
  };
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mypage-container">
      <h1 className="mypage-header">마이페이지</h1>
      <div className="mypage-section">
        <h2>프로필 정보</h2>
        {isEditing ? (
          <div>
            <input
              type="text"
              name="profileImageURL"
              value={userInfo.profileImageURL}
              onChange={handleInputChange}
              placeholder="프로필 이미지 URL"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <input
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleInputChange}
              placeholder="닉네임"
              required
            />
            <input
              type="text"
              name="introduction"
              value={userInfo.introduction}
              onChange={handleInputChange}
              placeholder="소개"
              required
            />
            <input
              type="text"
              name="favoriteGenres"
              value={userInfo.favoriteGenres}
              onChange={handleInputChange}
              placeholder="선호 장르"
              required
            />
            <input
              type="text"
              name="likes"
              value={userInfo.likes}
              onChange={handleInputChange}
              placeholder="추천 영화"
              required
            />
            <div className="mypage-buttons">
              <button type="button" onClick={handleSubmit}>저장</button>
              <button type="button" className="cancel" onClick={handleEditToggle}>취소</button>
            </div>
          </div>
        ) : (
          <div>
            <p><img src={userInfo.profileImageURL} alt="프로필 이미지" /></p>
            <p>닉네임: {userInfo.nickname}</p>
            <p>소개: {userInfo.introduction}</p>
            <p>선호 장르: {userInfo.favoriteGenres}</p>
            <p>추천 영화: {userInfo.likes}</p>
            <p>{userInfo.followers}</p>
            <p>팔로워</p>
            <p>{userInfo.following}</p>
            <p>팔로잉</p>
            <button type="button" onClick={handleEditToggle}>수정</button>
          </div>
        )}
      </div>
      <div className="mypage-section">
        <h2>리뷰 내역</h2>
        <p>{userInfo.reviews}</p>
      </div>
    </div>
  );
};

export default MyPage;