const passport = require("passport");
import { NextFunction, Request, Response } from "express";
import UserType from "../enums/UserType";
import { PostsDao } from "../dao/posts-dao";

export class PostsMiddleware {
  public static async canDeletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const postId = req.params.postId;
    const userId = req.query.id;

    try {
      const post = await PostsDao.getPostById(postId);

      if (!post) {
        return res.sendError("Post not found");
      }

      if (post.userId.toString() !== userId) {
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
    const userId = req.query.id;

    try {
      const comment = await PostsDao.getCommentById(postId, commentId);

      if (!comment) {
        return res.sendError("Comment not found");
      }

      if (comment.userId.toString() !== userId) {
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

  public static async canRemoveLike(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const likeId = req.params.likeId;
    const postId = req.params.postId;

    const userId = req.query.id;

    try {
      const like = await PostsDao.getLikeById(postId, likeId);

      if (!like) {
        return res.sendError("Like not found");
      }

      if (like.userId.toString() !== userId) {
        return res.sendError("You do not have permission to remove this like");
      }

      next();
    } catch (err) {
      console.error("Error checking like removal permission:", err);
      return res.sendError(
        "Something went wrong while checking like removal permission"
      );
    }
  }
}
