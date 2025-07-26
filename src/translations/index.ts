import { SupportedLocale, TranslationKeys } from '@/types/i18n';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { ja } from './ja';
import { zh } from './zh';

export const translations: Record<SupportedLocale, TranslationKeys> = {
  en,
  es,
  fr,
  de,
  pt,
  ja,
  zh,
};

export function getTranslation(locale: SupportedLocale): TranslationKeys {
  return translations[locale] || translations.en;
}