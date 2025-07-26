# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload (uses Turbopack)
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint for code quality

## Project Architecture

This is a NextJS 14 expense tracking application using the App Router pattern. The architecture follows a clean separation of concerns:

### Core Structure
- **App Router**: Uses NextJS 14 App Router in `src/app/` with layout and page components
- **Component Architecture**: Reusable React components in `src/components/` including Dashboard, ExpenseForm, ExpenseList, and Navigation
- **Data Management**: Custom hooks (`useExpenses.ts`) handle state management and localStorage operations
- **Type Safety**: Comprehensive TypeScript definitions in `src/types/expense.ts`

### Data Flow
- All expense data is stored in localStorage via `src/lib/storage.ts`
- `useExpenses` hook provides CRUD operations and state management
- Components consume data through the custom hook, maintaining single source of truth
- No external database - fully client-side persistence

### Key Technologies
- **NextJS 14** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **Lucide React** for icons

### Component Patterns
- Form components use React Hook Form with Zod validation schemas
- Dashboard uses Recharts for pie/bar charts showing expense analytics
- ExpenseList handles filtering, searching, and CSV export functionality
- All components follow responsive design patterns with Tailwind

### Storage Layer
The `storage.ts` utility provides:
- `getExpenses()` - Retrieve all expenses from localStorage
- `saveExpenses()` - Save expense array to localStorage
- `addExpense()`, `updateExpense()`, `deleteExpense()` - CRUD operations
- Server-side rendering safe (checks for `window` object)

### Expense Data Model
```typescript
interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: SupportedCurrency; // 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'MXN' | 'BRL'
  category: ExpenseCategory; // 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other'
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

## Internationalization & Multicurrency

The application supports multiple languages and currencies with automatic conversion and localization.

### Supported Features
- **Languages**: English, Spanish, French, German, Portuguese, Japanese, Chinese
- **Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, MXN, BRL
- **Automatic currency conversion** with static exchange rates
- **Locale-aware formatting** for dates and numbers
- **Persistent user preferences** stored in localStorage

### Key I18n Components
- `I18nProvider` - Context provider for internationalization state
- `LocaleSelector` - UI component for language/currency selection
- Translation files in `src/translations/` with type-safe keys
- Currency utilities in `src/lib/i18n.ts` for conversion and formatting

### Migration Support
The storage layer automatically migrates existing expenses to include currency fields, defaulting to USD for backward compatibility.

## Development Guidelines

### Adding New Languages
1. Create new translation file in `src/translations/[locale].ts`
2. Implement all keys from `TranslationKeys` interface
3. Add locale to `SUPPORTED_LOCALES` in `src/lib/i18n.ts`
4. Update `LOCALE_NAMES` mapping
5. Consider adding appropriate currency mapping in `LOCALE_CURRENCY_MAP`

### Adding New Currencies
1. Add currency code to `SupportedCurrency` type
2. Update `CURRENCY_INFO` with symbol, name, and decimals
3. Add exchange rate to `EXCHANGE_RATES` (use 1.0 for base currency)
4. Test formatting across different locales

### Key Implementation Details
- **Type Safety**: All translations use TypeScript interfaces for compile-time safety
- **Performance**: Translations and currency conversions are memoized in context
- **Fallback System**: Missing translations fall back to English, malformed currencies use symbol + amount
- **SSR Safe**: All localStorage operations check for `window` object existence
- **Responsive**: LocaleSelector adapts to mobile/desktop layouts automatically

### Testing Considerations
- Test with browser language detection
- Verify currency conversion accuracy
- Check locale formatting edge cases (e.g., currencies without decimals like JPY)
- Test data migration with existing localStorage data
- Verify all UI elements translate properly