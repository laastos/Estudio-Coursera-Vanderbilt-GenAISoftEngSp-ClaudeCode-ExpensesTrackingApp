import { Expense } from '@/types/expense';
import { SupportedCurrency } from '@/types/i18n';

const STORAGE_KEY = 'expense-tracker-data';
const MIGRATION_VERSION_KEY = 'expense-tracker-migration-version';
const CURRENT_VERSION = 1;

// Migration function to add currency field to existing expenses
function migrateExpenses(expenses: Expense[]): Expense[] {
  return expenses.map(expense => {
    if (!expense.currency) {
      return {
        ...expense,
        currency: 'USD' as SupportedCurrency, // Default to USD for existing expenses
      };
    }
    return expense;
  });
}

export const storage = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const expenses = JSON.parse(data);
      
      // Check if migration is needed
      const migrationVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
      if (!migrationVersion || parseInt(migrationVersion) < CURRENT_VERSION) {
        const migratedExpenses = migrateExpenses(expenses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedExpenses));
        localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION.toString());
        return migratedExpenses;
      }
      
      return expenses;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addExpense: (expense: Expense): void => {
    const expenses = storage.getExpenses();
    expenses.push(expense);
    storage.saveExpenses(expenses);
  },

  updateExpense: (updatedExpense: Expense): void => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex(exp => exp.id === updatedExpense.id);
    
    if (index !== -1) {
      expenses[index] = updatedExpense;
      storage.saveExpenses(expenses);
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = storage.getExpenses();
    const filteredExpenses = expenses.filter(exp => exp.id !== id);
    storage.saveExpenses(filteredExpenses);
  },

  clearAllExpenses: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};