# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload (uses Turbopack)
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint for code quality

## Project Architecture

This is a NextJS 14 expense tracking application using the App Router pattern with an innovative glass morphism design system. The architecture follows a clean separation of concerns:

### Core Structure
- **App Router**: Uses NextJS 14 App Router in `src/app/` with layout and page components
- **Component Architecture**: Reusable React components in `src/components/` including Dashboard, ExpenseForm, ExpenseList, Navigation, and FloatingActionButton
- **Design System**: Modern glass morphism design with CSS custom properties and theme system
- **Data Management**: Custom hooks (`useExpenses.ts`) handle state management and localStorage operations
- **Type Safety**: Comprehensive TypeScript definitions in `src/types/expense.ts` and `src/types/i18n.ts`

### Data Flow
- All expense data is stored in localStorage via `src/lib/storage.ts`
- `useExpenses` hook provides CRUD operations and state management
- Components consume data through the custom hook, maintaining single source of truth
- No external database - fully client-side persistence

### Key Technologies
- **NextJS 14** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** with custom CSS for glass morphism design system
- **CSS Custom Properties** for consistent theming and dark/light mode
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization with enhanced glass tooltips
- **Lucide React** for icons
- **Context API** for theme and internationalization state management

### Component Patterns
- **Glass Morphism Design**: All cards use `.glass-card` utility class with backdrop blur effects
- **Theme System**: `ThemeProvider` manages dark/light mode with CSS custom properties
- **Form Components**: Use React Hook Form with Zod validation and glass morphism styling
- **Dashboard**: Recharts with enhanced glass tooltips and gradient visualizations
- **ExpenseList**: Glass morphism cards with filtering, searching, and CSV export
- **FloatingActionButton**: Innovative expandable menu with smooth animations
- **Responsive Design**: Mobile-first approach with all components adapting to screen sizes

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

## Design System

The application features an innovative "Financial Zen" design system with glass morphism effects and modern UI patterns.

### Glass Morphism Features
- **Translucent Cards**: All components use glass morphism with backdrop blur effects
- **CSS Custom Properties**: Consistent theming variables for colors, gradients, and effects
- **Dynamic Themes**: Seamless dark/light mode switching with system preference detection
- **Smooth Animations**: Fade-in, slide-up, scale, and hover effects throughout the interface
- **Gradient Backgrounds**: Beautiful depth and visual interest with modern color schemes

### Key Design Classes
- `.glass-card` - Main glass morphism card utility
- `.hover-lift` - Subtle hover animation with transform
- `.animate-fade-in` - Fade in animation for page transitions
- `.animate-slide-up` - Slide up animation for elements
- `.gradient-text` - Gradient text effect for headings

### Theme System
- `ThemeProvider` context manages dark/light mode state
- CSS custom properties enable smooth theme transitions
- Automatic system preference detection on first visit
- Theme persistence across browser sessions

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
- `LocaleSelector` - Glass morphism UI component for language/currency selection
- Translation files in `src/translations/` with type-safe keys for all 7 languages
- Currency utilities in `src/lib/i18n.ts` for conversion and formatting
- `ThemeContext` - Manages theme preferences alongside i18n settings

### Migration Support
The storage layer automatically migrates existing expenses to include currency fields, defaulting to USD for backward compatibility.

## Development Guidelines

### Design System Guidelines
- **Always use glass morphism**: Apply `.glass-card` class to new components
- **Maintain consistency**: Use CSS custom properties from `:root` for colors and effects
- **Add hover effects**: Use `.hover-lift` for interactive elements
- **Include animations**: Apply appropriate animation classes for smooth transitions
- **Follow theme patterns**: Ensure new components work in both dark and light modes
- **Test responsiveness**: Verify components work across all screen sizes

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
- **Design Consistency**: Glass morphism effects applied consistently across all components
- **Theme Persistence**: Dark/light mode preferences saved in localStorage
- **Fallback System**: Missing translations fall back to English, malformed currencies use symbol + amount
- **SSR Safe**: All localStorage operations check for `window` object existence
- **Responsive**: All components adapt to mobile/desktop layouts automatically

### Testing Considerations
- **Design System**: Verify glass morphism effects work across browsers
- **Theme Switching**: Test dark/light mode toggle and persistence
- **Animations**: Check smooth transitions and hover effects
- **Responsive Design**: Test floating action button and navigation on mobile
- **Browser Compatibility**: Verify backdrop-filter support and fallbacks
- **Language Detection**: Test with browser language detection
- **Currency Conversion**: Verify accuracy and formatting
- **Locale Edge Cases**: Check currencies without decimals like JPY
- **Data Migration**: Test with existing localStorage data
- **UI Translation**: Verify all elements translate properly including new design components