'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Edit, Trash2, Download } from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseFilters } from '@/types/expense';
import { filterExpenses, exportToCSV, downloadCSV } from '@/lib/utils';
import { convertCurrency } from '@/lib/i18n';
import { useI18n } from '@/contexts/I18nContext';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categories: (ExpenseCategory | 'All')[] = ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const { t, currency, formatCurrency, formatDate: formatLocalDate } = useI18n();
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'All',
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, filters]);

  const handleExport = () => {
    const csvContent = exportToCSV(filteredExpenses);
    downloadCSV(csvContent, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t.navigation.expenses} ({filteredExpenses.length})
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {t.common.filter}
            </button>
            
            <button
              onClick={handleExport}
              disabled={filteredExpenses.length === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              {t.common.export}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.common.search}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.filters.searchPlaceholder}
                    value={filters.searchTerm || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.common.category}
                </label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ExpenseCategory | 'All' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">{t.filters.allCategories}</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {t.categories[category as ExpenseCategory]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.filters.dateFrom}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.filters.dateTo}
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ category: 'All', searchTerm: '', dateFrom: '', dateTo: '' })}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t.filters.clearFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {expenses.length === 0 ? (
              <>
                <p className="text-lg mb-2">{t.expense.noExpensesFound}</p>
                <p>{t.navigation.addExpense.toLowerCase()} to get started tracking your spending.</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">{t.expense.noExpensesFound}</p>
                <p>Try adjusting your search criteria or clearing the filters.</p>
              </>
            )}
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const convertedAmount = convertCurrency(expense.amount, expense.currency, currency);
            return (
              <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {t.categories[expense.category]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatLocalDate(expense.date)}
                      </span>
                      {expense.currency !== currency && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {expense.currency}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {expense.description}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(convertedAmount)}
                      </p>
                      {expense.currency !== currency && (
                        <p className="text-sm text-gray-500">
                          ({formatCurrency(expense.amount, expense.currency)})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title={t.common.edit}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title={t.common.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}