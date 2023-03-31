import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';
import { java } from '@codemirror/lang-java';
import { xml } from '@codemirror/lang-xml';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

export const LanguagesMap = {
  HTML: html(),
  PYTHON: python(),
  RUST: rust(),
  CPP: cpp(),
  PHP: php(),
  JAVASCRIPT: javascript(),
  SQL: sql(),
  MARKDOWN: markdown(),
  JAVA: java(),
  XML: xml(),
  CSS: css(),
  JSON: json(),
} as const;

export type Languages = keyof typeof LanguagesMap;
export const LanguagesArray = Object.keys(LanguagesMap) as Languages[];

export const ThemesMap = {
  ONE_DARK: oneDark,
};
export type Themes = keyof typeof ThemesMap;
export const ThemesArray = Object.keys(ThemesMap) as Themes[];

export const InitialCode = `export function filterExtensions(
  originExtensions: Extensions,
  options:
    | {
        type: 'category'
        category: Parameters<typeof filterExtensionsByCategory>[1]
      }
    | {
        type: 'search'
        searchValue: Parameters<typeof filterBySearchValue>[1]
      },
): Extensions {
  switch (options.type) {
    case 'category':
      return filterByCategory(originExtensions, options.category)
    case 'search':
    default:
      throw new Error('unknown options type')
  }
}`;
