const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  director: { type: String, required: true },
  precast: { type: [String], required: true },
  cast: { type: [String], required: true },
  releaseDate: { type: Date, required: true },
  boxOfficeRank: { type: Number, required: true },
  posterUrl: { type: String, required: true },
  synopsis: { type: String, required: true },
  stills: { type: [String], required: true },
  reviews: { type: Array, required: true }
  // reviews 필드 제거
});

module.exports = mongoose.model('Movie', movieSchema);
