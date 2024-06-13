import { PostsMiddleware } from "./../middleware/posts";
import { Express } from "express";
import { PostsEp } from "../end-points/posts-ep";

export function initPostsRoutes(app: Express) {
  app.post(
    //WORKING
    "/api/auth/post/create",
    PostsEp.postValidationRules(),
    PostsEp.createPost
  );
  app.get(
    //WORKING
    "/api/auth/post/get/:userId",
    PostsEp.getPostsByPostedUser
  );
  app.put(
    //WORKING
    "/api/auth/post/:postId/update/:userId",
    PostsMiddleware.canUpdatePost,
    PostsEp.updatePost
  );

  app.get(
    //WORKING
    "/api/auth/posts/get",
    PostsEp.getAllPosts
  );

  app.get(
    //WORKING
    "/api/auth/posts/get/:postId",
    PostsEp.getPostsByPostId
  );
  app.get(
    //WORKING
    "/api/auth/posts/get/posts/by/:userId",
    PostsEp.getPostsByUserId
  );

  app.post(
    //WORKING (Odd clicks = like, even clicks = unlike)
    "/api/auth/post/:postId/like/:userId",
    PostsEp.saveLike
  );

  app.post(
    //WORKING
    "/api/auth/post/:postId/comment/:userId",
    PostsEp.saveComment
  );

  app.delete(
    //WORKING
    "/api/auth/post/:postId/:userId",
    PostsMiddleware.canDeletePost,
    PostsEp.deletePost
  );

  app.delete(
    //WORKING
    "/api/auth/post/delete/comment/:postId/:commentId/:userId",
    PostsMiddleware.canDeleteComment,
    PostsEp.deleteComment
  );

  //===========================================================================

  app.post("/api/auth/listing/create", PostsEp.createListing);
  app.post(
    "/api/auth/request/create",
    PostsEp.createRequest
  );
  app.get("/api/auth/listings/get", PostsEp.getAllListings);
  app.get("/api/auth/listings/organs/get", PostsEp.getOrganListings);
  app.get("/api/auth/listings/equipment/get", PostsEp.getEquipmentListings);
  app.get("/api/auth/listings/other/get", PostsEp.getOtherListings);
  app.get("/api/auth/my/listings/organs/get/:userId", PostsEp.getMyOrganListings);
  app.get("/api/auth/my/listings/equipment/get/:userId", PostsEp.getMyEquipmentListings);
  app.get("/api/auth/my/listings/other/get/:userId", PostsEp.getMyOtherListings);
   app.get(
     "/api/auth/listing/get/:listingId",
     PostsEp.getListingByListingId
   );

  app.post("/api/auth/admin/post/delete/:postId", PostsEp.deletePostByAdmin);
}
