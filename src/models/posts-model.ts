import { Document, Schema, Types } from "mongoose";

interface PostComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

interface PostLike {
  user: Types.ObjectId;
}

export interface Post {
  user: Types.ObjectId;
  content: string;
  images?: Buffer;
  likesFrom: PostLike[];
  commentsFrom: PostComment[];
  createdAt: Date;
}