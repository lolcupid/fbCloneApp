const mongoose   = require('mongoose');

const commentSchema = new mongoose.Schema({
  ment: String,
  created_At: {type: Date, default: Date.now},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    userimage: String
  }
})

module.exports = mongoose.model('Comment', commentSchema);