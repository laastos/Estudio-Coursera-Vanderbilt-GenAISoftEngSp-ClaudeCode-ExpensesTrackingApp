'use client';

import { useState } from 'react';
import { Settings, Globe, DollarSign, ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { SUPPORTED_LOCALES, SUPPORTED_CURRENCIES, LOCALE_NAMES, CURRENCY_INFO } from '@/lib/i18n';
import { SupportedLocale, SupportedCurrency } from '@/types/i18n';
import { cn } from '@/lib/utils';

export default function LocaleSelector() {
  const { locale, currency, setLocale, setCurrency, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:block">{t.settings.preferences}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.settings.preferences}
              </h3>
              
              {/* Language Selection */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4" />
                  {t.settings.language}
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="w-full px-3 py-2 border rounded-xl select-accessible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 shadow-sm"
                >
                  {SUPPORTED_LOCALES.map((loc) => (
                    <option key={loc} value={loc}>
                      {LOCALE_NAMES[loc]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4" />
                  {t.settings.currency}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="w-full px-3 py-2 border rounded-xl select-accessible focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 shadow-sm"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr} value={curr}>
                      {CURRENCY_INFO[curr].symbol} {curr} - {CURRENCY_INFO[curr].name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  {locale === 'en' && 'Currency conversion rates are approximate and for display purposes only.'}
                  {locale === 'es' && 'Las tasas de conversión de moneda son aproximadas y solo para fines de visualización.'}
                  {locale === 'fr' && 'Les taux de conversion des devises sont approximatifs et à des fins d\'affichage uniquement.'}
                  {locale === 'de' && 'Währungsumrechnungskurse sind ungefähr und nur für Anzeigezwecke.'}
                  {locale === 'pt' && 'As taxas de conversão de moeda são aproximadas e apenas para fins de exibição.'}
                  {locale === 'ja' && '通貨換算レートは概算であり、表示目的のみです。'}
                  {locale === 'zh' && '货币转换汇率仅为近似值，仅用于显示目的。'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}