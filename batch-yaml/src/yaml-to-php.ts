import { transformTool } from "@he3-kit/utils";
import {  yamlExample } from "./utils/utils";
import yaml, { JSON_SCHEMA } from 'js-yaml'
import { ErrorLine } from "./utils/ErrorLine";
import json2php from 'json2php'

import { isYaml } from './isYaml'
export default transformTool({
  inputLang: "YAML",
  outputLang: "PHP",
  inputHandler: function (str: string) {
    try {
      const obj = yaml.load(str, { schema: JSON_SCHEMA })
      const printer = json2php.make({
        linebreak: '\n',
        indent: '\t\t',
        shortArraySyntax: true,
      })
      return `<?php\n\n\t$data = ${printer(obj)};`
    } catch (error: any) {
      if (error.mark) {
        throw new (ErrorLine as any)(error.message, error.mark.line + 1)
      } else {
        throw new Error(error.message)
      }
    }
  },//左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml
});
