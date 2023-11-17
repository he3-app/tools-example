import { transformTool } from "@he3-kit/utils";
import {  yamlExample } from "./utils/utils";
import yaml from 'js-yaml'
import jsonToKotlinClass from 'json-to-kotlin-class'
import { isYaml } from './isYaml'
export default transformTool({
  inputLang: "YAML",
  outputLang: "KOTLIN",
  inputHandler: function (str: string) {
    const obj = yaml.load(str)
      const jsonStr = JSON.stringify(obj, null, 2)
      const json = JSON.parse(jsonStr)
      return jsonToKotlinClass.init(json)
  },//左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml
});
