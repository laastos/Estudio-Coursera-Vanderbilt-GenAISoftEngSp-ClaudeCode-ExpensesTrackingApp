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
      Food: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      Transportation: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Shopping: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      Bills: 'bg-red-500/20 text-red-300 border-red-500/30',
      Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[category];
  };

  return (
    <div className="glass-card rounded-2xl animate-fade-in">
      <div className="p-6 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            {t.navigation.expenses} ({filteredExpenses.length})
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm glass border border-white/20 rounded-xl text-white hover-lift transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              {t.common.filter}
            </button>
            
            <button
              onClick={handleExport}
              disabled={filteredExpenses.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              {t.common.export}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 glass rounded-xl border border-white/20 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  {t.common.search}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder={t.filters.searchPlaceholder}
                    value={filters.searchTerm || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 glass border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  {t.common.category}
                </label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ExpenseCategory | 'All' }))}
                  className="w-full px-3 py-2 glass border rounded-xl select-accessible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
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
                <label className="block text-sm font-medium text-white/90 mb-1">
                  {t.filters.dateFrom}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">
                  {t.filters.dateTo}
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ category: 'All', searchTerm: '', dateFrom: '', dateTo: '' })}
                className="px-3 py-1 text-sm text-white/70 hover:text-white transition-colors"
              >
                {t.filters.clearFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-white/10">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-white/60">
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
              <div key={expense.id} className="p-6 hover:bg-white/5 transition-all duration-200 animate-slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                        {t.categories[expense.category]}
                      </span>
                      <span className="text-sm text-white/60">
                        {formatLocalDate(expense.date)}
                      </span>
                      {expense.currency !== currency && (
                        <span className="text-xs text-white/50 glass border border-white/20 px-2 py-1 rounded-full">
                          {expense.currency}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-white mb-1">
                      {expense.description}
                    </h3>
                    
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(convertedAmount)}
                      </p>
                      {expense.currency !== currency && (
                        <p className="text-sm text-white/60">
                          ({formatCurrency(expense.amount, expense.currency)})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-white/70 hover:text-blue-400 transition-colors hover-lift rounded-xl"
                      title={t.common.edit}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-white/70 hover:text-red-400 transition-colors hover-lift rounded-xl"
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