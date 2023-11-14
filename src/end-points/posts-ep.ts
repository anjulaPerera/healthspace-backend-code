
import { NextFunction, Request, Response } from "express";
import {
  check,
  param,
  ValidationChain,
  validationResult,
} from "express-validator";
import { DUser } from "../models/user-model";
import { AdminDao } from "../dao/admin-dao";
import LoginMethod from "../enums/LoginMethod";
import User from "../schemas/user-schema";
import { UserDao } from "../dao/user-dao";
import { Validations } from "../common/validation";
import { Util } from "../common/Util";
import UserStatus from "../enums/UserStatus";
import { PostsDao } from "../dao/posts-dao";
import { DPosts } from "../models/posts-model";
const { ObjectId } = require("mongodb");

export namespace PostsEp {
  export function postValidationRules(): ValidationChain[] {
    return [
      check("content")
        .notEmpty()
        .withMessage("Content is required")
        .isString()
        .withMessage("loginMethod is not valid type"),

    ];
  }

  export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendError(errors.array()[0]['msg']);
    }


    const content = req.body.content;
    // const images = req.body.images;
    const userId = req.query.id;


  const objectId = new ObjectId(userId);


    const postData: DPosts = {
      userId: objectId,
      content:content,
      // images,
      likesFrom: [],
      commentsFrom: [],
    };

    const savedPost = await PostsDao.savePost(postData);

    if (!savedPost) {
      return res.sendError('Failed to save post');
    }

  

    console.log('savedPost', savedPost);
    return res.sendSuccess(savedPost , 'Post Saved Successfully!');
  } catch (err) {
    console.log("in catch",err);
    return res.sendError(err);
  }
}
    export async function getPosts(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
            const userId = req.query.id as string;

      try {
        const userPosts = await PostsDao.getUserPosts(userId);
     userPosts ? res.sendSuccess(userPosts, "User posts Found!"): res.sendError("No posts found");
      
    } catch (err) {
      return res.sendError("Something Went Wrong!!");
    }
  }

  export async function saveLike(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const userId = req.query.id;

      const objectId = new ObjectId(userId);

      const updatedPost = await PostsDao.saveLike(postId, objectId);

      if (!updatedPost) {
        return res.sendError('Failed to save like');
      }

      return res.sendSuccess(updatedPost, 'Like Saved Successfully!');
    } catch (err) {
      console.log('in catch', err);
      return res.sendError(err);
    }
  }

   export async function saveComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const userId = req.query.id;
      const text = req.body.text;

      const objectId = new ObjectId(userId);

      const commentData = {
        userId: objectId,
        text,
      };

      const updatedPost = await PostsDao.saveComment(postId, commentData);

      if (!updatedPost) {
        return res.sendError('Failed to save comment');
      }

      return res.sendSuccess(updatedPost, 'Comment Saved Successfully!');
    } catch (err) {
      console.log('in catch', err);
      return res.sendError(err);
    }
  }


  export async function deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const userId = req.query.id;

      const post = await PostsDao.getPostById(postId);

      if (!post) {
        return res.sendError("Post not found");
      }

      if (post.userId.toString() !== userId) {
        return res.sendError("You do not have permission to delete this post");
      }

      const deletedPost = await post.remove();

      if (!deletedPost) {
        return res.sendError("Failed to delete post");
      }

      return res.sendSuccess({}, "Post Deleted Successfully!");
    } catch (err) {
      console.log("in catch", err);
      return res.sendError(err);
    }
  }

  export async function deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const userId = req.query.id;

      const comment = await PostsDao.getCommentById(postId, commentId);

      if (!comment) {
        return res.sendError("Comment not found");
      }

      if (comment.userId.toString() !== userId) {
        return res.sendError("You do not have permission to delete this comment");
      }

      const updatedPost = await PostsDao.deleteComment(postId, commentId);

      if (!updatedPost) {
        return res.sendError("Failed to delete comment");
      }

      return res.sendSuccess(updatedPost, "Comment Deleted Successfully!");
    } catch (err) {
      console.log("in catch", err);
      return res.sendError(err);
    }
  }

  export async function removeLike(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const postId = req.params.postId;
      const likeId = req.params.likeId;
      const userId = req.query.id;

      const like = await PostsDao.getLikeById(postId, likeId);

      if (!like) {
        return res.sendError("Like not found");
      }

      if (like.userId.toString() !== userId) {
        return res.sendError("You do not have permission to remove this like");
      }

      const updatedPost = await PostsDao.removeLike(postId, likeId);

      if (!updatedPost) {
        return res.sendError("Failed to remove like");
      }

      return res.sendSuccess(updatedPost, "Like Removed Successfully!");
    } catch (err) {
      console.log("in catch", err);
      return res.sendError(err);
    }
  }

 
 
}
