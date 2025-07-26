import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, ExpenseCategory, ExpenseSummary, ExpenseFilters } from '@/types/expense';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }
    
    if (filters.dateFrom && expenseDate < parseISO(filters.dateFrom)) {
      return false;
    }
    
    if (filters.dateTo && expenseDate > parseISO(filters.dateTo)) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return expense.description.toLowerCase().includes(searchLower) ||
             expense.category.toLowerCase().includes(searchLower);
    }
    
    return true;
  });
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyExpenses = expenses.filter(expense => 
    isWithinInterval(parseISO(expense.date), { start: monthStart, end: monthEnd })
  );
  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] += expense.amount;
  });
  
  const topCategory = Object.entries(categoryTotals)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a)[0];
  
  return {
    totalExpenses,
    monthlyTotal,
    categoryTotals,
    topCategory: topCategory ? { 
      category: topCategory[0] as ExpenseCategory, 
      amount: topCategory[1] 
    } : null,
  };
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Amount', 'Category', 'Description'];
  const rows = expenses.map(expense => [
    expense.date,
    expense.amount.toString(),
    expense.category,
    expense.description
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string = 'expenses.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}