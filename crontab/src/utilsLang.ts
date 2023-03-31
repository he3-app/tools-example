import { useI18n } from 'vue-i18n';
export enum langEnum {
  EN = 'en',
  ZH = 'zh',
  ZH_TW = 'zh-tw',
  ES = 'es',
  JA = 'ja',
  KO = 'ko',
  DE = 'de',
  FR = 'fr',
  IT = 'it',
  RU = 'ru',
  PT = 'pt',
}
export function getCurrentLang(): langEnum {
  const storageLanguage = localStorage.getItem('lang');
  if (storageLanguage) {
    return storageLanguage as langEnum;
  }
  if (navigator.language === 'zh-CN') {
    return langEnum.ZH;
  }
  return langEnum.EN;
}

export function changeLang(key: langEnum) {
  localStorage.setItem('lang', key);
}

export function i18n() {
  const { t } = useI18n();
  return { t };
}
