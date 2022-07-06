var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  genre: String,
  description: String,
  published_year: { type: Number, min: 1945, max: 2022 },
  publisher: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', BookSchema);