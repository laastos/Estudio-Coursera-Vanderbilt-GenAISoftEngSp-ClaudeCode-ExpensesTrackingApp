'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = () => {
      try {
        const savedExpenses = storage.getExpenses();
        setExpenses(savedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const addExpense = (formData: ExpenseFormData) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: generateId(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: now,
      updatedAt: now,
    };

    setExpenses(prev => {
      const updated = [...prev, newExpense];
      storage.saveExpenses(updated);
      return updated;
    });

    return newExpense;
  };

  const updateExpense = (id: string, formData: ExpenseFormData) => {
    setExpenses(prev => {
      const updated = prev.map(expense => 
        expense.id === id 
          ? {
              ...expense,
              ...formData,
              amount: parseFloat(formData.amount),
              updatedAt: new Date().toISOString(),
            }
          : expense
      );
      storage.saveExpenses(updated);
      return updated;
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => {
      const updated = prev.filter(expense => expense.id !== id);
      storage.saveExpenses(updated);
      return updated;
    });
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    storage.clearAllExpenses();
  };

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses,
  };
}