import { transformTool } from '@he3-kit/utils';
import { JsonExample } from '../example';
import { i18n } from '../locale';
import { isJson } from './isJson';

export default function register({
  lang,
  inputHandler,
  resultHandler,
  slot,
  example,
}: {
  lang: string;
  inputHandler: Function;
  resultHandler?: Function;
  slot?: {
    left?: unknown;
    right?: unknown;
  };
  example?: string;
}) {
  return transformTool({
    inputLang: 'JSON',
    outputLang: lang,
    inputHandler,
    resultHandler,
    inputPlaceHolder: i18n.global.t('json.input.placeholder'),
    sampleData: example || JsonExample,
    autoFillInputCondition: isJson,
    slot: {
      left: slot?.left,
      right: slot?.right,
    },
  });
}
