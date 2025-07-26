'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLocale, SupportedCurrency, LocaleConfig, TranslationKeys } from '@/types/i18n';
import { DEFAULT_LOCALE, DEFAULT_CURRENCY, LOCALE_CURRENCY_MAP } from '@/lib/i18n';
import { getTranslation } from '@/translations';

interface I18nContextType {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  t: TranslationKeys;
  setLocale: (locale: SupportedLocale) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number, targetCurrency?: SupportedCurrency) => string;
  formatDate: (date: string | Date) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'expense-tracker-i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [currency, setCurrencyState] = useState<SupportedCurrency>(DEFAULT_CURRENCY);
  const [t, setTranslations] = useState<TranslationKeys>(getTranslation(DEFAULT_LOCALE));

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const config: LocaleConfig = JSON.parse(saved);
          setLocaleState(config.locale);
          setCurrencyState(config.currency);
          setTranslations(getTranslation(config.locale));
        } else {
          // Try to detect browser language
          const browserLang = navigator.language.split('-')[0] as SupportedLocale;
          if (['en', 'es', 'fr', 'de', 'pt'].includes(browserLang)) {
            setLocaleState(browserLang);
            setCurrencyState(LOCALE_CURRENCY_MAP[browserLang]);
            setTranslations(getTranslation(browserLang));
          }
        }
      } catch {
        console.error('Error loading i18n preferences');
      }
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    setTranslations(getTranslation(newLocale));
    
    if (typeof window !== 'undefined') {
      const config: LocaleConfig = { locale: newLocale, currency };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  };

  const setCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    
    if (typeof window !== 'undefined') {
      const config: LocaleConfig = { locale, currency: newCurrency };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  };

  const formatCurrency = (amount: number, targetCurrency?: SupportedCurrency): string => {
    const currencyToUse = targetCurrency || currency;
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyToUse,
      }).format(amount);
    } catch {
      // Fallback formatting
      const symbols: Record<SupportedCurrency, string> = {
        USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$',
        AUD: 'A$', CHF: 'CHF', CNY: '¥', MXN: '$', BRL: 'R$'
      };
      return `${symbols[currencyToUse]}${amount.toFixed(2)}`;
    }
  };

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    } catch {
      return dateObj.toLocaleDateString();
    }
  };

  const value: I18nContextType = {
    locale,
    currency,
    t,
    setLocale,
    setCurrency,
    formatCurrency,
    formatDate,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}