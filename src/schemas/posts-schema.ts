import { Schema, Types, model, Document } from 'mongoose';
var mongoose = require("mongoose");



const postsSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: Buffer,
    required: false,
  },
  likesFrom: [
    {
      userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
  commentsFrom: [
    {
      userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Posts = mongoose.model("Posts", postsSchema);

export default Posts;
