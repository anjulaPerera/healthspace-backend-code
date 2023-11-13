import * as mongoose from "mongoose";


interface Common {
  content: string;
  images?: Buffer;
  likesFrom: [];
  commentsFrom: [];
}

export interface DPosts extends Common {}
export interface IPosts extends Common, mongoose.Document {}

