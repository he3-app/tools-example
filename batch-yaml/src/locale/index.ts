import { createI18n } from 'vue-i18n';
import en from './lang/en.json';
import de from './lang/de.json';
import es from './lang/es.json';
import fr from './lang/fr.json';
import it from './lang/it.json';
import ja from './lang/ja.json';
import ko from './lang/ko.json';
import pt from './lang/pt.json';
import ru from './lang/ru.json';
import zh_tw from './lang/zh-tw.json';
import zh from './lang/zh.json';

export const i18n = createI18n({
  locale: window?.$he3?.lang ?? 'en',
  messages: {
    de,
    en,
    es,
    fr,
    it,
    ja,
    ko,
    pt,
    ru,
    zh_tw,
    zh,
  },
});
