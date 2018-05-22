const mongoose   = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  ment: String,
  created_At: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Comment', commentSchema);