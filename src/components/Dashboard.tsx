'use client';

import { useMemo } from 'react';
import { DollarSign, TrendingUp, CreditCard, Award } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { calculateExpenseSummary } from '@/lib/utils';
import { convertCurrency } from '@/lib/i18n';
import { useI18n } from '@/contexts/I18nContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = {
  Food: '#10B981',
  Transportation: '#3B82F6',
  Entertainment: '#8B5CF6',
  Shopping: '#EC4899',
  Bills: '#EF4444',
  Other: '#6B7280',
};

export default function Dashboard({ expenses }: DashboardProps) {
  const { t, currency, formatCurrency } = useI18n();
  const summary = useMemo(() => calculateExpenseSummary(expenses, currency), [expenses, currency]);

  const chartData = useMemo(() => {
    return Object.entries(summary.categoryTotals)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        color: COLORS[category as ExpenseCategory],
      }));
  }, [summary.categoryTotals]);

  const monthlyData = useMemo(() => {
    const last6Months: { month: string; amount: number }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && 
               expenseDate.getFullYear() === date.getFullYear();
      });
      
      const totalAmount = monthExpenses.reduce((sum, expense) => 
        sum + convertCurrency(expense.amount, expense.currency, currency), 0
      );
      last6Months.push({ month: monthName, amount: totalAmount });
    }
    
    return last6Months;
  }, [expenses, currency]);

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: string; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <div className="glass-card rounded-2xl p-6 hover-lift animate-slide-up">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.dashboard.totalExpenses}
          value={formatCurrency(summary.totalExpenses)}
          icon={DollarSign}
          color="bg-blue-500"
        />
        <StatCard
          title={t.dashboard.thisMonth}
          value={formatCurrency(summary.monthlyTotal)}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title={t.dashboard.transactions}
          value={expenses.length.toString()}
          icon={CreditCard}
          color="bg-purple-500"
        />
        <StatCard
          title={t.dashboard.topCategory}
          value={summary.topCategory ? t.categories[summary.topCategory.category] : 'None'}
          icon={Award}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 hover-lift animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">{t.dashboard.spendingByCategory}</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${t.categories[name as ExpenseCategory]}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)} 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/60">
              <p>{t.dashboard.noExpenses}</p>
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 hover-lift animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">{t.dashboard.monthlySpendingTrend}</h3>
          {monthlyData.some(data => data.amount > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/60">
              <p>{t.dashboard.noSpendingData}</p>
            </div>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="glass-card rounded-2xl p-6 hover-lift animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4">{t.dashboard.categoryBreakdown}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 glass border border-white/20 rounded-xl hover-lift transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-white">{t.categories[category.name as ExpenseCategory]}</span>
                </div>
                <span className="font-bold text-white">
                  {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}