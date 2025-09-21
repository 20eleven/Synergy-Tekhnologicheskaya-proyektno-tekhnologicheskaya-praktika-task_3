import { useState, useEffect, useCallback } from 'react';
import { postService } from '../services/postService';
import { Post, Comment } from '../types';

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export const usePosts = (initialTags?: string[]) => {
  const [postsState, setPostsState] = useState<PostsState>({
    posts: [],
    isLoading: true,
    error: null,
  });
  const [tags, setTags] = useState<string[]>(initialTags || []);

  const fetchPosts = useCallback(async (page = 1, limit = 10) => {
    setPostsState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await postService.getPosts(page, limit, tags);
      setPostsState({
        posts,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setPostsState({
        posts: [],
        isLoading: false,
        error: (error as Error).message,
      });
    }
  }, [tags]); // Tags only in deps

  const createPost = useCallback(async (data: any) => {
    try {
      const newPost = await postService.createPost(data);
      await fetchPosts(1, 10);
      return newPost;
    } catch (error) {
      throw error;
    }
  }, [fetchPosts]);

  const updatePost = useCallback(async (id: string, data: any) => {
    try {
      const updatedPost = await postService.updatePost(id, data);
      await fetchPosts(1, 10);
      return updatedPost;
    } catch (error) {
      throw error;
    }
  }, [fetchPosts]);

  const deletePost = useCallback(async (id: string) => {
    try {
      await postService.deletePost(id);
      setPostsState(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchPosts(1, 10);
  }, [fetchPosts]); // fetchPosts only in deps

  return {
    ...postsState,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    tags,
    setTags,
  };
};

export const usePostDetail = (postId: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPost = await postService.getPostById(postId);
      setPost(fetchedPost);
      
      const fetchedComments = await postService.getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(async (content: string) => {
    try {
      const newComment = await postService.createComment(postId, content);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (error) {
      throw error;
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPost]);

  return {
    post,
    comments,
    isLoading,
    error,
    fetchPost,
    addComment,
  };
};