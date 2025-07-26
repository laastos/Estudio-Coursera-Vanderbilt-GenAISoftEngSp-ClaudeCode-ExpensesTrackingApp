export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'pt';

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'MXN' | 'BRL';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  decimals: number;
}

export interface LocaleConfig {
  locale: SupportedLocale;
  currency: SupportedCurrency;
}

export interface TranslationKeys {
  common: {
    add: string;
    edit: string;
    delete: string;
    cancel: string;
    save: string;
    loading: string;
    search: string;
    filter: string;
    export: string;
    clear: string;
    confirm: string;
    total: string;
    date: string;
    amount: string;
    category: string;
    description: string;
  };
  navigation: {
    dashboard: string;
    expenses: string;
    addExpense: string;
  };
  dashboard: {
    totalExpenses: string;
    thisMonth: string;
    transactions: string;
    topCategory: string;
    spendingByCategory: string;
    monthlySpendingTrend: string;
    categoryBreakdown: string;
    noExpenses: string;
    noSpendingData: string;
  };
  expense: {
    addExpense: string;
    editExpense: string;
    updateExpense: string;
    deleteExpenseConfirm: string;
    expenseAdded: string;
    expenseUpdated: string;
    expenseDeleted: string;
    noExpensesFound: string;
    itemsPerPage: string;
  };
  categories: {
    Food: string;
    Transportation: string;
    Entertainment: string;
    Shopping: string;
    Bills: string;
    Other: string;
  };
  filters: {
    allCategories: string;
    dateFrom: string;
    dateTo: string;
    searchPlaceholder: string;
    clearFilters: string;
  };
  validation: {
    dateRequired: string;
    amountRequired: string;
    amountPositive: string;
    descriptionRequired: string;
    descriptionMaxLength: string;
  };
  settings: {
    language: string;
    currency: string;
    preferences: string;
  };
}