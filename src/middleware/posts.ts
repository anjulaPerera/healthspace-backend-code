const passport = require("passport");
import { NextFunction, Request, Response } from "express";
import UserType from "../enums/UserType";
import { PostsDao } from "../dao/posts-dao";

export class PostsMiddleware {
  public static async canUpdatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
      const post = await PostsDao.getPostById(postId);

      if (!post) {
        return res.sendError("Post not found");
      }

      if (post.userId.toString() !== userId.toString()) {
        console.log("post.userId", post.userId);
        console.log("userId", userId);
        return res.sendError("You do not have permission to update this post");
      }

      next();
    } catch (err) {
      console.error("Error checking post update permission:", err);
      return res.sendError(
        "Something went wrong while checking post update permission"
      );
    }
  }
  public static async canDeletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
      const post = await PostsDao.getPostById(postId);

      if (!post) {
        return res.sendError("Post not found");
      }

      if (post.userId.toString() !== userId.toString()) {
        return res.sendError("You do not have permission to delete this post");
      }

      next();
    } catch (err) {
      console.error("Error checking post deletion permission:", err);
      return res.sendError(
        "Something went wrong while checking post deletion permission"
      );
    }
  }
  public static async canDeleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const userId = req.params.userId;

       console.log("postId delete comment", postId);
      console.log("commentId delete comment", commentId);
      console.log("userId delete comment", userId);

    try {
      const comment = await PostsDao.getCommentById(postId, commentId);

      if (!comment) {
        return res.sendError("Comment not found !!!!!!!!!");
      }

      if (comment.userId.toString() !== userId.toString()) {
        return res.sendError(
          "You do not have permission to delete this comment"
        );
      }

      next();
    } catch (err) {
      console.error("Error checking comment deletion permission:", err);
      return res.sendError(
        "Something went wrong while checking comment deletion permission"
      );
    }
  }

}
