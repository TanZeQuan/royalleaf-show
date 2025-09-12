import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from 'locales/en.json';
import ms from 'locales/ms.json';
import zhCN from 'locales/zh-CN.json';
import zhTW from 'locales/zh-TW.json';

// 获取设备首选语言
const deviceLocale = Localization.getLocales?.()[0]?.languageTag || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ms: { translation: ms },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
    },
    lng: deviceLocale,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // RN 不使用 Suspense
  });

export default i18n;
