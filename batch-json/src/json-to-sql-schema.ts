import transform from 'transform-json-types';
import register from './utils/register';
import { jsonToSchema, schemaToJson } from './utils/json2SQL';

const transform = (inputValue: string) => {
  return jsonToSchema(JSON.parse(inputValue));
};

const reverseTransform = (inputValue: string) => {
  return schemaToJson(inputValue)?.json;
};

export default register({
  lang: 'SQL',
  inputHandler: transform,
  resultHandler: reverseTransform,
});
