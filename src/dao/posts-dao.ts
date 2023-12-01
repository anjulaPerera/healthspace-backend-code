import { DPosts, IComment, ILike, IPosts } from "../models/posts-model";
import Posts from "../schemas/posts-schema";
import { ObjectId } from "mongodb";

export namespace PostsDao {
  export async function savePost(postData: DPosts): Promise<IPosts | null> {
    try {
      const savedPost = await Posts.create(postData);
      return savedPost;
    } catch (error) {
      throw error;
    }
  }

  export async function getUserPostsByPostedUser(userId: string): Promise<IPosts[]> {
    try {
      const userPosts = await Posts.find({ userId }).exec();
      return userPosts;
    } catch (error) {
      throw error;
    }
  }


export async function updatePost(postId: string, updatedData: any): Promise<DPosts | null> {
  try {
    const post = await Posts.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updatedData },
      { new: true }
    );

    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

  export async function getAllPosts(): Promise<IPosts[]> {
    try {
      const allPosts = await Posts.find().exec();
      return allPosts;
    } catch (error) {
      throw error;
    }
  }

  // export async function saveLike(
  //   postId: string,
  //   userId: string
  // ): Promise<IPosts | null> {
  //   try {
  //     const post = await this.getPostById(postId);

  //     if (!post) {
  //       throw new Error("Post not found");
  //     }

  //     const alreadyLiked = post.likesFrom.some(
  //       (like) => like.userId.toString() === userId
  //     );

  //     if (alreadyLiked) {
  //       throw new Error("User has already liked this post");
  //     }

  //     // Add the new like
  //     post.likesFrom.push({ userId: new ObjectId(userId) });

  //     // Save the updated post
  //     const updatedPost = await post.save();
  //     return updatedPost;
  //   } catch (error) {
  //     console.error("Error saving like:", error);
  //     return null;
  //   }
  // }

export async function saveLike(
  postId: string,
  userId: string
): Promise<IPosts | null> {
  try {
    const post = await this.getPostById(postId);
    console.log("post save like dao",post);

    if (!post) {
      throw new Error("Post not found");
    }

      console.log('Current likesFrom:', post.likesFrom);
    const alreadyLiked = post.likesFrom.some((like) => {
      console.log('Comparing:', like.userId.toString(), "AND",  userId);
      return like.userId.toString() === userId.toString();
    });

    console.log("alreadyLiked",alreadyLiked);

    if (alreadyLiked) {
      console.log("already liked");
      post.likesFrom = post.likesFrom.filter(
        (like) => like.userId.toString() !== userId.toString()
      );
    } else {
         console.log("not already liked");
      post.likesFrom.push({ userId: new ObjectId(userId) });
    }

    const updatedPost = await post.save();
    return updatedPost;
  } catch (error) {
    console.error("Error saving like:", error);
    return null;
  }
}


  export async function saveComment(
    postId: string,
    commentData: { userId: string; text: string }
  ): Promise<IPosts | null> {
    try {
      const post = await this.getPostById(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      // Add the new comment
      post.commentsFrom.push({
        userId: new ObjectId(commentData.userId),
        text: commentData.text,
      });

      // Save the updated post
      const updatedPost = await post.save();
      return updatedPost;
    } catch (error) {
      console.error("Error saving comment:", error);
      return null;
    }
  }

  export async function getPostById(postId: string): Promise<IPosts | null> {
    try {
      const post = await Posts.findOne({ _id: new ObjectId(postId) });
      return post;
    } catch (error) {
      console.error("Error getting post by ID:", error);
      return null;
    }
  }
  export async function getPostsByUserId(userId: string): Promise<IPosts[]> {
    try {
      const posts = await Posts.find({ userId }).exec();
      return posts;
    } catch (error) {
      throw error;
    }
  }

  export async function getCommentById(
    postId: string,
    commentId: string
  ): Promise<IComment | null> {
    try {
      const post = await Posts.findOne({
        _id: new ObjectId(postId),
        "commentsFrom._id": new ObjectId(commentId),
      });

      if (post) {
        const comment = post.commentsFrom.find(
          (c) => c._id.toString() === commentId
        );
        return comment || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting comment by ID:", error);
      return null;
    }
  }

  export async function getLikeById(
    postId: string,
    likeId: string
  ): Promise<ILike | null> {
    try {
      const post = await Posts.findOne({
        _id: new ObjectId(postId),
        "likesFrom._id": new ObjectId(likeId),
      });

      if (post) {
        const like = post.likesFrom.find((l:any) => l._id.toString() === likeId);
        return like || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting like by ID:", error);
      return null;
    }
  }
  export async function deleteComment(
    postId: string,
    commentId: string
  ): Promise<IPosts | null> {
    try {
      const post = await getPostById(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      // Find the index of the comment in the array
      const commentIndex = post.commentsFrom.findIndex(
        (c) => c._id.toString() === commentId
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }

      // Remove the comment from the array
      post.commentsFrom.splice(commentIndex, 1);

      // Save the updated post
      const updatedPost = await post.save();
      return updatedPost;
    } catch (error) {
      console.error("Error deleting comment:", error);
      return null;
    }
  }

  export async function removeLike(
    postId: string,
    likeId: string
  ): Promise<IPosts | null> {
    try {
      const post = await getPostById(postId);

      if (!post) {
        throw new Error("Post not found");
      }

      // Find the index of the like in the array
      const likeIndex = post.likesFrom.findIndex(
        (l) => l._id.toString() === likeId
      );

      if (likeIndex === -1) {
        throw new Error("Like not found");
      }

      // Remove the like from the array
      post.likesFrom.splice(likeIndex, 1);

      // Save the updated post
      const updatedPost = await post.save();
      return updatedPost;
    } catch (error) {
      console.error("Error removing like:", error);
      return null;
    }
  }
}
