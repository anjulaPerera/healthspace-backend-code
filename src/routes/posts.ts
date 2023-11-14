import { PostsMiddleware } from './../middleware/posts';
import { Express } from "express";
import { PostsEp } from "../end-points/posts-ep";

export function initPostsRoutes(app: Express) {

  app.post(
    "/api/auth/post/create",
    PostsEp.postValidationRules(),
    PostsEp.createPost
  );

   app.post('/api/auth/post/:postId/like', PostsEp.saveLike);

  app.post('/api/auth/post/:postId/comment', PostsEp.saveComment);
  
  app.delete(
    '/api/auth/post/:postId',
    PostsMiddleware.canDeletePost,
    PostsEp.deletePost
  );

  app.delete(
    '/api/auth/comment/:postId/:commentId',
     PostsMiddleware.canDeleteComment,
    PostsEp.deleteComment
  );

  app.delete(
    '/api/auth/like/:postId/:likeId',
     PostsMiddleware.canRemoveLike,
    PostsEp.removeLike
  );

}
