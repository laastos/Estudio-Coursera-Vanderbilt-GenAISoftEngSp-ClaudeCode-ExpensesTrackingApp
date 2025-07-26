'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { useI18n } from '@/contexts/I18nContext';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';

type View = 'dashboard' | 'expenses' | 'add';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { t } = useI18n();

  const handleAddExpense = (formData: ExpenseFormData) => {
    addExpense(formData);
    setCurrentView('expenses');
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setCurrentView('add');
  };

  const handleUpdateExpense = (formData: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
      setCurrentView('expenses');
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setCurrentView('expenses');
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm(t.expense.deleteExpenseConfirm)) {
      deleteExpense(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t.navigation.dashboard}</h1>
              <p className="mt-2 text-gray-600">Overview of your spending</p>
            </div>
            <Dashboard expenses={expenses} />
          </div>
        )}

        {currentView === 'expenses' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t.navigation.expenses}</h1>
              <p className="mt-2 text-gray-600">View and manage your expenses</p>
            </div>
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {currentView === 'add' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {editingExpense ? t.expense.editExpense : t.expense.addExpense}
              </h1>
              <p className="mt-2 text-gray-600">
                {editingExpense ? 'Update your expense details' : 'Record a new expense'}
              </p>
            </div>
            <ExpenseForm 
              onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
              initialData={editingExpense ? {
                date: editingExpense.date,
                amount: editingExpense.amount.toString(),
                currency: editingExpense.currency,
                category: editingExpense.category,
                description: editingExpense.description,
              } : undefined}
              isEditing={!!editingExpense}
              onCancel={editingExpense ? handleCancelEdit : undefined}
            />
          </div>
        )}
      </main>
    </div>
  );
}
