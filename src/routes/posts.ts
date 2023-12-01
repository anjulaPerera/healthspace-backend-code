import { PostsMiddleware } from './../middleware/posts';
import { Express } from "express";
import { PostsEp } from "../end-points/posts-ep";

export function initPostsRoutes(app: Express) {

  app.post(                                                       //WORKING
    "/api/auth/post/create",
    PostsEp.postValidationRules(),
    PostsEp.createPost
  );
  app.get(                                                        //WORKING
    "/api/auth/post/get/:userId",
    PostsEp.getPostsByPostedUser
  );
  app.put(                                                        //WORKING
    '/api/auth/post/:postId/update/:userId',
    PostsMiddleware.canUpdatePost,
    PostsEp.updatePost);

  app.get(                                                        //WORKING
    "/api/auth/posts/get",
    PostsEp.getAllPosts
  );

    app.get(                                                        //WORKING
    "/api/auth/posts/get/:postId",
    PostsEp.getPostsByPostId
  );

  app.post(                                                       //WORKING (Odd clicks = like, even clicks = unlike)
    '/api/auth/post/:postId/like/:userId', 
    PostsEp.saveLike);

  app.post(                                                       //WORKING
    '/api/auth/post/:postId/comment/:userId',
    PostsEp.saveComment);
  
  app.delete(                                                     //WORKING
    '/api/auth/post/:postId/:userId',
    PostsMiddleware.canDeletePost,
    PostsEp.deletePost
  );

  app.delete(                                                     //WORKING
    '/api/auth/post/delete/comment/:postId/:commentId/:userId',
    PostsMiddleware.canDeleteComment,
    PostsEp.deleteComment
  );



}
