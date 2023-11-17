import { transformTool } from '@he3-kit/utils';
import yaml, { JSON_SCHEMA } from 'js-yaml';
import jsonToKotlinClass from 'json-to-kotlin-class';
import { yamlExample } from './utils/utils';
import { ErrorLine } from './utils/ErrorLine';
import prettyJson from 'json-stringify-pretty-compact';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'KOTLIN',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    const json = JSON.parse(jsonStr);
    return jsonToKotlinClass('welcome',json)
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});

function jsonToKotlinClass(className, json) {
  let classString = `data class ${className} (\n`;

  Object.entries(json).forEach(([key, value]) => {
    let type;
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        const elementType = `${className}_${key}_Item`;
        classString += `    val ${key}: List<${elementType}>,\n`;
        classString += jsonToKotlinClass(elementType, value[0]);
        return;
      } else {
        type = typeof value[0];
      }
    } else {
      type = typeof value;
    }

    let propertyType;
    switch (type) {
      case "boolean":
        propertyType = "Boolean";
        break;
      case "number":
        if (Number.isInteger(value)) {
          propertyType = "Int";
        } else {
          propertyType = "Double";
        }
        break;
      case "string":
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
          propertyType = "Date";
        } else {
          if (key === "tags") {
            propertyType = "List<String>";
          } else {
            propertyType = "String";
          }
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
            const elementType = `${className}_${key}_Item`;
            propertyType = `List<${elementType}>`;
            classString += jsonToKotlinClass(elementType, value[0]);
          }
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
            propertyType = "List<String>";
          }
        }
        break;
      case "object":
        if (value === null) {
          propertyType = "Any?";
        } else {
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
            const elementType = `${className}_${key}_Item`;
            propertyType = `List<${elementType}>`;
            classString += jsonToKotlinClass(elementType, value[0]);
          } else {
            const nestedType = `${className}_${key}_Nested`;
            propertyType = nestedType;
            classString += `    val ${key}: ${nestedType}? = ${jsonToKotlinClass(nestedType, value)}(),\n`;
          }
        }
        break;
      default:
        throw new Error(`Unhandled type: ${type}`);
    }

    classString += `    val ${key}: ${propertyType},\n`;
  });

  classString += `)`;

  return classString;
}
