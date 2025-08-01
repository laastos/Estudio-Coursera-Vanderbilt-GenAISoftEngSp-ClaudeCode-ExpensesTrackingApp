# ExpenseTracker - Personal Finance Management App

A modern, professional NextJS expense tracking application that helps users manage their personal finances with multilingual and multicurrency support, featuring an innovative glass morphism design and comprehensive analytics.

## 🚀 Features

### Core Functionality
- **Add Expenses**: Create new expenses with date, amount, currency, category, and description
- **View Expenses**: Browse expenses in a clean, organized list with multicurrency display
- **Filter & Search**: Filter by date range, category, and search by description
- **Edit & Delete**: Modify or remove existing expenses with confirmation
- **Data Persistence**: All data is stored locally using localStorage with automatic migration

### 🌍 Internationalization & Currency Support
- **Multiple Languages**: English, Spanish, French, German, Portuguese, Japanese, Chinese
- **10+ Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, MXN, BRL
- **Real-time Currency Conversion**: Automatic conversion with visual indicators
- **Locale-aware Formatting**: Dates and numbers formatted according to user's locale
- **Smart Language Detection**: Automatically detects browser language on first visit
- **Persistent Preferences**: Language and currency choices saved across sessions

### Dashboard & Analytics
- **Summary Cards**: Total expenses, monthly spending, transaction count, top category (all in preferred currency)
- **Visual Charts**: Pie chart for category breakdown and bar chart for monthly trends with currency conversion
- **Category Breakdown**: Detailed view of spending by category with color coding and multicurrency support
- **Cross-currency Analytics**: All data automatically converted to user's preferred currency for accurate reporting

### 🎨 Modern UI Design (NEW!)
- **Glass Morphism**: Innovative translucent cards with backdrop blur effects
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Floating Action Button**: Quick access expandable menu for main actions
- **Smooth Animations**: Delightful micro-interactions and transitions throughout
- **Gradient Backgrounds**: Beautiful visual depth with modern color schemes
- **Enhanced Visual Hierarchy**: Clear information structure with proper spacing

### Export & Management
- **Enhanced CSV Export**: Export filtered expenses with currency information to CSV format
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with intuitive navigation and settings panel
- **Currency Indicators**: Visual badges showing original currency when different from display currency

## 🛠 Technical Stack

- **Framework**: NextJS 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom CSS for glass morphism effects
- **Design System**: CSS custom properties for consistent theming
- **Charts**: Recharts for data visualization with enhanced glass tooltips
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Storage**: localStorage for data persistence
- **Internationalization**: Custom React Context with type-safe translations
- **Currency Conversion**: Built-in exchange rate system with fallback formatting
- **Theme System**: Dark/light mode with automatic system detection

## 📋 Categories

The app supports the following expense categories:
- 🍔 Food
- 🚗 Transportation  
- 🎬 Entertainment
- 🛍️ Shopping
- 📋 Bills
- 📦 Other

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd expense-tracking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 How to Use

### 1. Dashboard
- View your spending overview with summary statistics
- See visual charts of your spending patterns
- Monitor monthly trends and category breakdowns

### 2. Adding Expenses
- Click "Add Expense" in the navigation
- Fill out the form with:
  - Date of the expense
  - Amount (automatically formatted as currency)
  - Category selection
  - Description of the expense
- Form validation ensures all required fields are completed

### 3. Managing Expenses
- Go to "Expenses" to view all your transactions
- Use filters to narrow down by:
  - Date range (from/to dates)
  - Category selection
  - Text search in descriptions
- Click edit icon to modify an expense
- Click delete icon to remove an expense (with confirmation)

### 4. Exporting Data
- In the Expenses view, click "Export" to download a CSV file
- Export includes all currently filtered expenses
- File is named with current date for easy organization

## 🎨 Design Features

### Responsive Design
- **Mobile-first approach**: Optimized for mobile devices
- **Adaptive layouts**: Components adjust to different screen sizes
- **Touch-friendly**: Large buttons and intuitive gestures

### User Experience
- **Loading states**: Smooth transitions and feedback
- **Error handling**: Form validation and user-friendly error messages
- **Confirmation dialogs**: Prevent accidental deletions
- **Visual feedback**: Color-coded categories and interactive elements

### ✨ Innovative Design Features (NEW!)
- **Glass Morphism Effects**: Translucent cards with backdrop blur
- **Dynamic Theme System**: Automatic dark/light mode switching
- **Floating Action Button**: Expandable quick-access menu
- **Smooth Animations**: Fade-in, slide-up, and scale effects
- **Gradient Backgrounds**: Beautiful depth and visual interest
- **Enhanced Hover Effects**: Subtle lift animations and micro-interactions
- **Modern Typography**: Clean fonts with gradient text effects
- **Advanced CSS**: Custom properties and modern layout techniques

## 📊 Data Structure

Expenses are stored with the following enhanced structure:
```typescript
interface Expense {
  id: string;              // Unique identifier
  date: string;            // ISO date string
  amount: number;          // Expense amount in original currency
  currency: SupportedCurrency; // Currency code (USD, EUR, GBP, etc.)
  category: ExpenseCategory; // One of the 6 categories
  description: string;     // User-provided description
  createdAt: string;       // Creation timestamp
  updatedAt: string;       // Last modification timestamp
}
```

### Supported Currencies
- **USD** - US Dollar ($)
- **EUR** - Euro (€)
- **GBP** - British Pound (£)
- **JPY** - Japanese Yen (¥)
- **CAD** - Canadian Dollar (C$)
- **AUD** - Australian Dollar (A$)
- **CHF** - Swiss Franc (CHF)
- **CNY** - Chinese Yuan (¥)
- **MXN** - Mexican Peso ($)
- **BRL** - Brazilian Real (R$)

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Adding Expenses**
   - [ ] Add expense with all fields filled including currency selection
   - [ ] Try submitting with empty fields (should show validation errors)
   - [ ] Add expense with negative amount (should show validation error)
   - [ ] Add expenses in different categories and currencies
   - [ ] Test currency dropdown functionality

2. **Viewing Expenses**
   - [ ] Navigate to expenses list
   - [ ] Verify expenses are sorted by date (newest first)
   - [ ] Check that all expense details display correctly with currency conversion
   - [ ] Verify currency badges appear for expenses in different currencies
   - [ ] Test that converted amounts show alongside original amounts

3. **Filtering & Search**
   - [ ] Filter by each category
   - [ ] Set date range filters
   - [ ] Search by description text
   - [ ] Combine multiple filters
   - [ ] Clear all filters

4. **Editing & Deleting**
   - [ ] Click edit button and modify an expense
   - [ ] Cancel editing without saving
   - [ ] Save edited expense and verify changes
   - [ ] Delete an expense with confirmation
   - [ ] Cancel deletion when prompted

5. **Dashboard**
   - [ ] View summary cards with correct totals in preferred currency
   - [ ] Check pie chart shows category breakdown with localized labels
   - [ ] Verify bar chart shows monthly trends with currency formatting
   - [ ] Add expenses in different currencies and see dashboard update with conversions

6. **Internationalization & Currency**
   - [ ] Click settings gear icon to open locale selector
   - [ ] Switch between English and Spanish languages
   - [ ] Verify all UI text updates to selected language
   - [ ] Change currency and verify all amounts convert properly
   - [ ] Test that preferences persist after page reload
   - [ ] Verify date formatting changes with locale
   - [ ] Check currency symbols and formatting are correct

7. **Modern UI Design (NEW!)**
   - [ ] Test theme toggle button in navigation
   - [ ] Verify glass morphism effects on cards and forms
   - [ ] Check floating action button expandable menu
   - [ ] Test smooth animations and hover effects
   - [ ] Verify gradient backgrounds and visual depth
   - [ ] Test dark/light mode persistence across page reloads

8. **Export Functionality**
   - [ ] Export all expenses to CSV with currency information
   - [ ] Apply filters and export filtered results
   - [ ] Open CSV file and verify data format includes currency column

9. **Responsive Design**
   - [ ] Test on mobile device or browser dev tools
   - [ ] Verify navigation menu works on mobile with settings panel
   - [ ] Check all forms are usable on small screens including currency dropdown
   - [ ] Ensure charts display properly on all screen sizes
   - [ ] Test floating action button on mobile devices

10. **Data Persistence & Migration**
    - [ ] Add expenses and refresh the page
    - [ ] Close and reopen browser
    - [ ] Verify all data persists correctly with currency information
    - [ ] Test automatic migration from old data format (if applicable)

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Project Structure
```
src/
├── app/                 # NextJS app router
│   ├── globals.css      # Global styles with glass morphism design system
│   ├── layout.tsx       # Root layout with theme providers
│   └── page.tsx         # Main application page
├── components/          # React components
│   ├── Dashboard.tsx    # Analytics dashboard with glass effects
│   ├── ExpenseForm.tsx  # Modern form with glass morphism
│   ├── ExpenseList.tsx  # Glass morphism expense cards
│   ├── FloatingActionButton.tsx  # Innovative expandable FAB
│   ├── LocaleSelector.tsx       # Language/currency selector
│   └── Navigation.tsx   # Glass morphism navigation bar
├── contexts/            # React contexts
│   ├── I18nContext.tsx  # Internationalization context
│   └── ThemeContext.tsx # Dark/light mode theme system
├── hooks/              # Custom React hooks
├── lib/                # Utility functions, storage, and i18n utilities
├── translations/        # Translation files for 7 supported languages
└── types/              # TypeScript type definitions
```

## 💾 Data Storage

This application uses localStorage for data persistence, which means:
- Data is stored locally in your browser
- Data persists between browser sessions  
- Data is not shared between different browsers/devices
- No server or database required
- **Automatic migration**: Existing data is automatically migrated to include currency fields
- **Backward compatibility**: Works seamlessly with expenses created before currency support

For production use, you could easily extend this to use a backend API by modifying the storage utility functions.

## 🎯 Future Enhancements

Potential features that could be added:
- User authentication and cloud sync
- Budget tracking and alerts
- Recurring expense management  
- Advanced reporting and insights
- Receipt photo uploads
- **Live exchange rates** via API integration
- **Additional languages** and regional variants
- **Custom categories** with user-defined names
- **Income tracking** alongside expenses
- Data backup/restore to cloud storage
- **Enhanced animations** and micro-interactions
- **Settings modal** for the floating action button
- **Chart customization** options
- **Accessibility improvements** for screen readers

---

**ExpenseTracker** - Take control of your personal finances with professional-grade expense tracking featuring multilingual support, multicurrency capabilities, and an innovative glass morphism design. ✨🌍💰📊
