const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    required: true
  },
  likes: [{
    type: ObjectId,
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('card', cardSchema);