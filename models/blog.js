const mongoose   = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  post: String,
  created_At: {type: Date, default: Date.now},
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
})

module.exports = mongoose.model('Blog', blogSchema);
