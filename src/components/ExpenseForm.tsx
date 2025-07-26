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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? t.expense.editExpense : t.expense.addExpense}
        </h2>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              {t.common.date}
            </label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.date ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              {t.common.amount}
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              placeholder="0.00"
              {...register('amount')}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.amount ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              {t.settings.currency}
            </label>
            <select
              id="currency"
              {...register('currency')}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.currency ? "border-red-300" : "border-gray-300"
              )}
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {CURRENCY_INFO[curr].symbol} {curr} - {CURRENCY_INFO[curr].name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            {t.common.category}
          </label>
          <select
            id="category"
            {...register('category')}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              errors.category ? "border-red-300" : "border-gray-300"
            )}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {t.categories[category]}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {t.common.description}
          </label>
          <input
            type="text"
            id="description"
            placeholder={t.filters.searchPlaceholder}
            {...register('description')}
            className={cn(
              "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              errors.description ? "border-red-300" : "border-gray-300"
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors",
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? t.common.loading : isEditing ? t.expense.updateExpense : t.common.add + ' ' + t.expense.addExpense.split(' ')[1]}
          </button>
          
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {t.common.cancel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}