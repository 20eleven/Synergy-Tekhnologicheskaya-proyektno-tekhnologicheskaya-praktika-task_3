import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

interface TagsState {
  tags: string[];
  isLoading: boolean;
  error: string | null;
}

export const useTags = () => {
  const [tagsState, setTagsState] = useState<TagsState>({
    tags: [],
    isLoading: false,
    error: null,
  });

  const fetchTags = async () => {
    setTagsState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const tags = await postService.getTags();
      setTagsState({
        tags,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setTagsState({
        tags: [],
        isLoading: false,
        error: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    ...tagsState,
    fetchTags,
  };
};