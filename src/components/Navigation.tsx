'use client';

import { useState } from 'react';
import { Menu, X, BarChart3, Plus, List, Home, Moon, Sun } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import LocaleSelector from './LocaleSelector';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: 'dashboard' | 'expenses' | 'add';
  onViewChange: (view: 'dashboard' | 'expenses' | 'add') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

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
    <nav className="glass-card border-0 border-b border-white/20 sticky top-0 z-40 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ExpenseTracker</span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover-lift",
                    currentView === item.id
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 hover-lift"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            
            <LocaleSelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
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
        <div className="md:hidden animate-slide-up">
          <div className="px-4 pt-2 pb-4 space-y-2 glass border-t border-white/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    currentView === item.id
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="px-4 py-2">
              <LocaleSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}