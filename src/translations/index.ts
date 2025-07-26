import { SupportedLocale, TranslationKeys } from '@/types/i18n';
import { en } from './en';
import { es } from './es';

export const translations: Record<SupportedLocale, TranslationKeys> = {
  en,
  es,
  fr: en, // Fallback to English for now
  de: en, // Fallback to English for now
  pt: en, // Fallback to English for now
};

export function getTranslation(locale: SupportedLocale): TranslationKeys {
  return translations[locale] || translations.en;
}