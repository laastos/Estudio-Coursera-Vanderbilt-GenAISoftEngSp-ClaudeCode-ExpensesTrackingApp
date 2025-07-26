import { SupportedCurrency } from './i18n';

export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: SupportedCurrency;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  currency: SupportedCurrency;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'All';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyTotal: number;
  categoryTotals: Record<ExpenseCategory, number>;
  topCategory: { category: ExpenseCategory; amount: number } | null;
}