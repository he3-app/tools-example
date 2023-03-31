/**
 * Languages for CodeMirror
 */
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
import { wast } from '@codemirror/lang-wast';

// Legacy languages mode support: https://www.npmjs.com/package/@codemirror/legacy-modes
import { StreamLanguage } from '@codemirror/language';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { c, csharp, dart, kotlin, objectiveC, scala } from '@codemirror/legacy-modes/mode/clike';
import { go } from '@codemirror/legacy-modes/mode/go';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { elm } from '@codemirror/legacy-modes/mode/elm';
import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { r } from '@codemirror/legacy-modes/mode/r';
import { toml } from '@codemirror/legacy-modes/mode/toml';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { crystal } from '@codemirror/legacy-modes/mode/crystal';

/**
 * Themes for CodeMirror
 */
import { abcdef } from '@uiw/codemirror-theme-abcdef';
import { androidstudio } from '@uiw/codemirror-theme-androidstudio';
import { atomone } from '@uiw/codemirror-theme-atomone';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { bespin } from '@uiw/codemirror-theme-bespin';
// import { darcula } from '@uiw/codemirror-theme-darcula'
// import { dracula } from '@uiw/codemirror-theme-dracula'
import { duotoneDark, duotoneLight } from '@uiw/codemirror-theme-duotone';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { oneDark } from '@codemirror/theme-one-dark';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { xcodeDark, xcodeLight } from '@uiw/codemirror-theme-xcode';

export const CodeEditorLanguages = {
  HTML: html(),
  PYTHON: python(),
  RUST: rust(),
  C: StreamLanguage.define(c),
  CPP: cpp(),
  CSHARP: StreamLanguage.define(csharp),
  CRYSTAL: StreamLanguage.define(crystal),
  OBJECTIVE_C: StreamLanguage.define(objectiveC),
  KOTLIN: StreamLanguage.define(kotlin),
  DART: StreamLanguage.define(dart),
  PHP: php(),
  PROPERTIES: StreamLanguage.define(properties),
  JAVASCRIPT: javascript(),
  TYPESCRIPT: javascript({ typescript: true }),
  JSX: javascript({ jsx: true }),
  TSX: javascript({ typescript: true, jsx: true }),
  SQL: sql(),
  SHELL: StreamLanguage.define(shell),
  SCALA: StreamLanguage.define(scala),
  MARKDOWN: markdown(),
  JAVA: java(),
  XML: xml(),
  CSS: css(),
  JSON: json(),
  WEB_ASSEMBLY: wast(),
  LUA: StreamLanguage.define(lua),
  RUBY: StreamLanguage.define(ruby),
  R: StreamLanguage.define(r),
  GO: StreamLanguage.define(go),
  SWIFT: StreamLanguage.define(swift),
  ELM: StreamLanguage.define(elm),
  HASKELL: StreamLanguage.define(haskell),
  YAML: StreamLanguage.define(yaml),
  TOML: StreamLanguage.define(toml),
};
export type CodeEditorLanguagesUnion = keyof typeof CodeEditorLanguages;
export const CodeEditorLanguagesDisplayName: {
  [key in CodeEditorLanguagesUnion]: string;
} = {
  C: 'C',
  CPP: 'C++',
  CSHARP: 'C#',
  CSS: 'CSS',
  CRYSTAL: 'Crystal',
  DART: 'Dart',
  ELM: 'Elm',
  GO: 'Go',
  HASKELL: 'Haskell',
  HTML: 'HTML',
  JAVA: 'Java',
  JAVASCRIPT: 'JavaScript',
  JSON: 'JSON',
  JSX: 'JSX',
  KOTLIN: 'Kotlin',
  LUA: 'Lua',
  MARKDOWN: 'MarkDown',
  OBJECTIVE_C: 'Objective-C',
  PHP: 'PHP',
  PROPERTIES: 'Properties',
  PYTHON: 'Python',
  R: 'R',
  RUBY: 'Ruby',
  RUST: 'Rust',
  SHELL: 'Shell',
  SQL: 'SQL',
  SWIFT: 'Swift',
  SCALA: 'Scala',
  TSX: 'TSX',
  TYPESCRIPT: 'TypeScript',
  TOML: 'TOML',
  WEB_ASSEMBLY: 'Web Assembly',
  XML: 'XML',
  YAML: 'YAML',
};

export const CodeEditorThemes = {
  ANDROID_STUDIO: androidstudio,
  ABCDEF: abcdef,
  ATOMONE: atomone,
  BBEDIT: bbedit,
  BESPIN: bespin,
  // DARCULA: darcula,
  // DRACULA: dracula,
  DUOTONE_LIGHT: duotoneLight,
  DUOTONE_DARK: duotoneDark,
  ECLIPSE: eclipse,
  GITHUB_LIGHT: githubLight,
  GITHUB_DARK: githubDark,
  ONE_DARK: oneDark,
  OKAIDIA: okaidia,
  SUBLIME: sublime,
  X_CODE_LIGHT: xcodeLight,
  X_CODE_DARK: xcodeDark,
};
export type CodeEditorThemesUnion = keyof typeof CodeEditorThemes;
export const CodeEditorThemesDisplayName: {
  [key in CodeEditorThemesUnion]: string;
} = {
  ANDROID_STUDIO: 'Android Studio',
  ABCDEF: 'Abcdef',
  ATOMONE: 'Atomone',
  BBEDIT: 'Bbedit',
  BESPIN: 'Bespin',
  // DARCULA: 'Darcula',
  // DRACULA: 'Dracula',
  DUOTONE_LIGHT: 'Duotone Light',
  DUOTONE_DARK: 'Duotone Dark',
  ECLIPSE: 'Eclipse',
  GITHUB_LIGHT: 'GitHub Light',
  GITHUB_DARK: 'Github Dark',
  ONE_DARK: 'OneDark',
  OKAIDIA: 'Okaidia',
  SUBLIME: 'Sublime',
  X_CODE_LIGHT: 'Xcode Light',
  X_CODE_DARK: 'Xcode Dark',
};

export const InitialCode = `import { isProduction } from '@/utils.ts';
import { DoDollar } from 'dodollar';
import dodollar from 'dodollar';

const $$ = new DoDollar({
  batchIntercept: {
    batchInterceptHook: () => {
      // Intercept every output when in the production environment.
      if (isProduction() === true) {
        return true;
      }
      return false;
    },
  },
  batchBefore: {
    batchBeforeHook: () => {
      dodollar
        .log('I am monitor every methods before hook execution.')
        .separate();
    },
  },
  batchAfter: {
    batchAfterHook: () => {
      dodollar
        .log('Ok, I finish my monitor after hook execution.')
        .separate('*');
    },
  },
});

export { $$ };`;
