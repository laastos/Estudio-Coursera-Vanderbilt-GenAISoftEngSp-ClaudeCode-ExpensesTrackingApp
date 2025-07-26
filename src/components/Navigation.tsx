'use client';

import { useState } from 'react';
import { Menu, X, BarChart3, Plus, List, Home } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import LocaleSelector from './LocaleSelector';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: 'dashboard' | 'expenses' | 'add';
  onViewChange: (view: 'dashboard' | 'expenses' | 'add') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useI18n();

  const navItems = [
    { id: 'dashboard' as const, label: t.navigation.dashboard, icon: Home },
    { id: 'expenses' as const, label: t.navigation.expenses, icon: List },
    { id: 'add' as const, label: t.navigation.addExpense, icon: Plus },
  ];

  const handleNavClick = (view: 'dashboard' | 'expenses' | 'add') => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ExpenseTracker</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    currentView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <LocaleSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors",
                    currentView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="px-3 py-2">
              <LocaleSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}