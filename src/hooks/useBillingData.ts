import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BillingData {
  id: string;
  available_funds: number;
  last_payment_amount: number | null;
  last_payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyBilling {
  id: string;
  month: number;
  year: number;
  net_cost: number;
  payments: number;
  funds_from_previous: number;
  campaigns: number;
  adjustments: number;
  taxes_and_fees: number;
  ending_balance: number;
  created_at: string;
  updated_at: string;
}

export const useBillingData = () => {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [monthlyBilling, setMonthlyBilling] = useState<MonthlyBilling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch billing data
  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Fetch main billing data
      const { data: billingResult, error: billingError } = await supabase
        .from('billing_data')
        .select('*')
        .limit(1)
        .single();

      if (billingError) throw billingError;
      setBillingData(billingResult);

      // Fetch monthly billing data
      const { data: monthlyResult, error: monthlyError } = await supabase
        .from('monthly_billing')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false });

      if (monthlyError) throw monthlyError;
      setMonthlyBilling(monthlyResult || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching billing data');
    } finally {
      setLoading(false);
    }
  };

  // Update billing data
  const updateBillingData = async (updates: Partial<BillingData>) => {
    if (!billingData) return;

    try {
      const { data, error } = await supabase
        .from('billing_data')
        .update(updates)
        .eq('id', billingData.id)
        .select()
        .single();

      if (error) throw error;
      setBillingData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating billing data');
      throw err;
    }
  };

  // Update monthly billing
  const updateMonthlyBilling = async (id: string, updates: Partial<MonthlyBilling>) => {
    try {
      const { data, error } = await supabase
        .from('monthly_billing')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setMonthlyBilling(prev => 
        prev.map(item => item.id === id ? { ...item, ...data } : item)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating monthly billing');
      throw err;
    }
  };

  // Add new monthly billing record (alias for consistency)
  const createMonthlyBilling = async (monthData: Omit<MonthlyBilling, 'id' | 'created_at' | 'updated_at'>) => {
    return addMonthlyBilling(monthData);
  };

  // Add new monthly billing record
  const addMonthlyBilling = async (monthData: Omit<MonthlyBilling, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('monthly_billing')
        .insert([monthData])
        .select()
        .single();

      if (error) throw error;
      
      setMonthlyBilling(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding monthly billing');
      throw err;
    }
  };

  // Delete monthly billing record
  const deleteMonthlyBilling = async (id: string) => {
    try {
      const { error } = await supabase
        .from('monthly_billing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMonthlyBilling(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting monthly billing');
      throw err;
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  return {
    billingData,
    monthlyBilling,
    loading,
    error,
    updateBillingData,
    updateMonthlyBilling,
    addMonthlyBilling,
    createMonthlyBilling,
    deleteMonthlyBilling,
    refreshData: fetchBillingData
  };
};