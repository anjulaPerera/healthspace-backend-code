import * as mongoose from "mongoose";

interface Comment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

interface Like {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

interface Common {
  content: string;
  images?: string;
  likesFrom: Like[];
  commentsFrom: Comment[];
  userId: mongoose.Types.ObjectId;
}

export interface DPosts extends Common {}
export interface IPosts extends Common, mongoose.Document {}
export interface IComment extends Comment {}
export interface ILike extends Like {}
