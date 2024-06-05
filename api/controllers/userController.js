const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.mypage = async (req, res) => {
  try {
    // 현재 로그인한 사용자의 정보를 데이터베이스에서 가져옵니다.
    const currentUser = await User.findOne({ username: req.user.username });
    
    // 사용자 정보 중에서 userinfo 필드만 클라이언트에 반환합니다.
    const userinfo = currentUser.userinfo;
    
    // userinfo 정보를 클라이언트에 반환합니다.
    res.status(200).json({ userinfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
