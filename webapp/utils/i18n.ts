import english from '@/public/locales/en/common.json';
import i18n from 'i18next';

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development', // Print i18n logs only if running under dev environment
  resources: {
    en: {
      translation: english,
    },
  },
});

export default i18n.t;