'use client';

import { useMemo } from 'react';
import { DollarSign, TrendingUp, CreditCard, Award } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { calculateExpenseSummary, formatCurrency } from '@/lib/utils';
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
  const summary = useMemo(() => calculateExpenseSummary(expenses), [expenses]);

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
      
      const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      last6Months.push({ month: monthName, amount: totalAmount });
    }
    
    return last6Months;
  }, [expenses]);

  const StatCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: string; 
    icon: React.ElementType; 
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={DollarSign}
          color="bg-blue-500"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(summary.monthlyTotal)}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="Transactions"
          value={expenses.length.toString()}
          icon={CreditCard}
          color="bg-purple-500"
        />
        <StatCard
          title="Top Category"
          value={summary.topCategory?.category || 'None'}
          icon={Award}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No expenses to display</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          {monthlyData.some(data => data.amount > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No spending data to display</p>
            </div>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="font-bold text-gray-900">
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