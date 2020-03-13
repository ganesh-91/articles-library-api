import * as mongoose from 'mongoose';

export const ArticleSchema = new mongoose.Schema({
  url: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  image: String,
  description: String,
  created: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 0,
  }
});
