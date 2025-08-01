'use client';

import { useState } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { useExpenses } from '@/hooks/useExpenses';
import { useI18n } from '@/contexts/I18nContext';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import FloatingActionButton from '@/components/FloatingActionButton';

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
    <div className="min-h-screen">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
        {currentView === 'dashboard' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold gradient-text mb-2">{t.navigation.dashboard}</h1>
              <p className="text-white/80 text-lg">Your financial journey at a glance</p>
            </div>
            <Dashboard expenses={expenses} />
          </div>
        )}

        {currentView === 'expenses' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold gradient-text mb-2">{t.navigation.expenses}</h1>
              <p className="text-white/80 text-lg">Track and manage all your expenses</p>
            </div>
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}

        {currentView === 'add' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {editingExpense ? t.expense.editExpense : t.expense.addExpense}
              </h1>
              <p className="text-white/80 text-lg">
                {editingExpense ? 'Update your expense details' : 'Record a new expense'}
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
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
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton
        onAddExpense={() => setCurrentView('add')}
        onViewDashboard={() => setCurrentView('dashboard')}
        onOpenSettings={() => {/* TODO: Implement settings modal */}}
      />
    </div>
  );
}
