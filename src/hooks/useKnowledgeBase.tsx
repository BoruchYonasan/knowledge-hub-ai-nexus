
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: 'all' | 'hr' | 'engineering' | 'sales' | 'finance' | 'operations';
  author: string;
  read_time: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = () => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async (article: Omit<KnowledgeBaseArticle, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      setArticles(prev => [data, ...prev]);
      toast({
        title: "Article Created",
        description: "Knowledge base article has been created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateArticle = async (id: string, updates: Partial<KnowledgeBaseArticle>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setArticles(prev => prev.map(article => 
        article.id === id ? data : article
      ));
      toast({
        title: "Article Updated",
        description: "Knowledge base article has been updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Error",
        description: "Failed to update article",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_base_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setArticles(prev => prev.filter(article => article.id !== id));
      toast({
        title: "Article Deleted",
        description: "Knowledge base article has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    loading,
    createArticle,
    updateArticle,
    deleteArticle,
    refetch: fetchArticles
  };
};
