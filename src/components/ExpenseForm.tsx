'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X } from 'lucide-react';
import { ExpenseFormData, ExpenseCategory } from '@/types/expense';
import { SUPPORTED_CURRENCIES, CURRENCY_INFO } from '@/lib/i18n';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL']),
  category: z.enum(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other']),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be 200 characters or less'),
});

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

const categories: ExpenseCategory[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export default function ExpenseForm({ onSubmit, initialData, isEditing = false, onCancel }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, currency } = useI18n();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      currency: currency,
      category: 'Food',
      description: '',
    }
  });

  const handleFormSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      if (!isEditing) {
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? t.expense.editExpense : t.expense.addExpense}
        </h2>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-white/70 hover:text-white transition-colors hover-lift rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-white/90 mb-1">
              {t.common.date}
            </label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className={cn(
                "w-full px-3 py-2 glass border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200",
                errors.date ? "border-red-400" : "border-white/20"
              )}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-white/90 mb-1">
              {t.common.amount}
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              placeholder="0.00"
              {...register('amount')}
              className={cn(
                "w-full px-3 py-2 glass border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200",
                errors.amount ? "border-red-400" : "border-white/20"
              )}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-white/90 mb-1">
              {t.settings.currency}
            </label>
            <select
              id="currency"
              {...register('currency')}
              className={cn(
                "w-full px-3 py-2 glass border rounded-xl select-accessible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200",
                errors.currency ? "border-red-400" : ""
              )}
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_INFO[curr].symbol} {curr} - {CURRENCY_INFO[curr].name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-400">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white/90 mb-1">
            {t.common.category}
          </label>
          <select
            id="category"
            {...register('category')}
            className={cn(
              "w-full px-3 py-2 glass border rounded-xl select-accessible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200",
              errors.category ? "border-red-400" : ""
            )}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {t.categories[category]}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-1">
            {t.common.description}
          </label>
          <input
            type="text"
            id="description"
            placeholder={t.filters.searchPlaceholder}
            {...register('description')}
            className={cn(
              "w-full px-3 py-2 glass border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200",
              errors.description ? "border-red-400" : "border-white/20"
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 hover-lift shadow-lg",
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            )}
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? t.common.loading : isEditing ? t.expense.updateExpense : t.common.add + ' ' + t.expense.addExpense.split(' ')[1]}
          </button>
          
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 glass border border-white/20 text-white rounded-xl font-medium hover-lift transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              {t.common.cancel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}