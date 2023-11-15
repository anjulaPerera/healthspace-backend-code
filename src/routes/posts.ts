import { PostsMiddleware } from './../middleware/posts';
import { Express } from "express";
import { PostsEp } from "../end-points/posts-ep";

export function initPostsRoutes(app: Express) {

  app.post(                                               //WORKING
    "/api/auth/post/create",
    PostsEp.postValidationRules(),
    PostsEp.createPost
  );
  app.get(                                                //WORKING
    "/api/auth/post/get/:userId",
    PostsEp.getPostsByPostedUser
  );
  app.get(                                                //WORKING
    "/api/auth/posts/get",
    PostsEp.getAllPosts
  );



   app.post('/api/auth/post/:postId/like/:userId', PostsEp.saveLike);                        //WORKING (Odd clicks = like, even clicks = unlike)

  app.post('/api/auth/post/:postId/comment/:userId', PostsEp.saveComment);                   //WORKING
  
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
