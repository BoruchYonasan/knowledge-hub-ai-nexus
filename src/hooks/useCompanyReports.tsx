
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyReport {
  id: string;
  title: string;
  description?: string;
  content?: string;
  author: string;
  report_type: string;
  created_at: string;
  updated_at: string;
}

export const useCompanyReports = () => {
  const [reports, setReports] = useState<CompanyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('company_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching company reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch company reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: Omit<CompanyReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('company_reports')
        .insert(reportData)
        .select()
        .single();

      if (error) throw error;
      
      setReports(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Company report created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating company report:', error);
      toast({
        title: 'Error',
        description: 'Failed to create company report',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<CompanyReport>) => {
    try {
      const { data, error } = await supabase
        .from('company_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setReports(prev => prev.map(report => report.id === id ? data : report));
      toast({
        title: 'Success',
        description: 'Company report updated successfully',
      });
      return data;
    } catch (error) {
      console.error('Error updating company report:', error);
      toast({
        title: 'Error',
        description: 'Failed to update company report',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('company_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReports(prev => prev.filter(report => report.id !== id));
      toast({
        title: 'Success',
        description: 'Company report deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting company report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete company report',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    createReport,
    updateReport,
    deleteReport,
    refetch: fetchReports,
  };
};
