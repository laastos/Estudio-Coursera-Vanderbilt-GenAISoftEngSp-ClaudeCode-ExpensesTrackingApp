'use client';

import { useState } from 'react';
import { Plus, X, Receipt, TrendingUp, Settings } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onAddExpense: () => void;
  onViewDashboard: () => void;
  onOpenSettings: () => void;
}

export default function FloatingActionButton({ onAddExpense, onViewDashboard, onOpenSettings }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const actions = [
    {
      icon: Receipt,
      label: t.navigation.addExpense,
      onClick: () => {
        onAddExpense();
        setIsOpen(false);
      },
      color: 'bg-emerald-500 hover:bg-emerald-600',
    },
    {
      icon: TrendingUp,
      label: t.navigation.dashboard,
      onClick: () => {
        onViewDashboard();
        setIsOpen(false);
      },
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Settings,
      label: t.settings.preferences,
      onClick: () => {
        onOpenSettings();
        setIsOpen(false);
      },
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-4 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 transition-all duration-300 ease-in-out",
                isOpen ? "translate-y-0" : "translate-y-4"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="glass-card px-3 py-2 rounded-full text-sm font-medium text-white/90 hidden sm:block">
                {action.label}
              </div>
              <button
                onClick={action.onClick}
                className={cn(
                  "w-12 h-12 rounded-full text-white shadow-lg hover-lift flex items-center justify-center transition-all duration-200",
                  action.color
                )}
              >
                <Icon className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full text-white shadow-xl hover-lift flex items-center justify-center transition-all duration-300 ease-in-out",
          "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
          isOpen && "rotate-45"
        )}
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}