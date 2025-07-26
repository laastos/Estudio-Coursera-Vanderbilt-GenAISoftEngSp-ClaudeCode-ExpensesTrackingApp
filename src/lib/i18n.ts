import { SupportedLocale, SupportedCurrency, CurrencyInfo } from '@/types/i18n';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'es', 'fr', 'de', 'pt'];
export const SUPPORTED_CURRENCIES: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'MXN', 'BRL'];

export const CURRENCY_INFO: Record<SupportedCurrency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', decimals: 2 },
  MXN: { code: 'MXN', symbol: '$', name: 'Mexican Peso', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', decimals: 2 },
};

export const DEFAULT_LOCALE: SupportedLocale = 'en';
export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

export const LOCALE_CURRENCY_MAP: Record<SupportedLocale, SupportedCurrency> = {
  en: 'USD',
  es: 'EUR',
  fr: 'EUR',
  de: 'EUR',
  pt: 'BRL',
};

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
};

// Exchange rates (in a real app, these would come from an API)
export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,     // Base currency
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  MXN: 20.0,
  BRL: 5.2,
};

export function convertCurrency(amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  return usdAmount * EXCHANGE_RATES[toCurrency];
}

export function formatCurrency(amount: number, currency: SupportedCurrency, locale: SupportedLocale): string {
  const currencyInfo = CURRENCY_INFO[currency];
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyInfo.decimals,
      maximumFractionDigits: currencyInfo.decimals,
    }).format(amount);
  } catch {
    // Fallback formatting
    return `${currencyInfo.symbol}${amount.toFixed(currencyInfo.decimals)}`;
  }
}

export function formatDate(date: string | Date, locale: SupportedLocale): string {
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
}