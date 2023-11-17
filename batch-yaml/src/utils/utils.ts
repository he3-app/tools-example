import yaml, { JSON_SCHEMA } from 'js-yaml';
import YAML from 'yaml';
import { ErrorLine } from './ErrorLine';
export function jsonToYaml(str: string) {
  try {
    const json = JSON.parse(str);
    const doc = new YAML.Document();
    doc.contents = json;
    return doc.toString();
  } catch (e: any) {
    parseErrorLine(e.message, str);
  }
}

export function objToYaml(obj: object) {
  try {
    const doc = new YAML.Document();
    doc.contents = obj;
    return doc.toString();
  } catch {
    return obj;
  }
}

export function parseErrorLine(message: string, str: string) {
  const num = (message as string).split('at position ')[1];
  if (num) {
    // 找到错误行后返回
    let index = Number.parseInt(num);
    const lineList = str.split('\n');
    for (const [i, element] of lineList.entries()) {
      index -= element.length;
      if (index <= i + 1) {
        throw new (ErrorLine as any)(message, i + 1);
      }
    }
  } else {
    throw new Error(message);
  }
}

export const JSONToProperty = (jsonObj: { [x: string]: any }) => {
  const mappings: string[] = [];
  const isNumeric = function (n: string | number) {
    return !isNaN(Number.parseFloat(n as string)) && isFinite(n as number);
  };

  const formatJsonPropMappings = function (jsonParent: string, k: string, v: any) {
    const jsonpath = formatJsonPath(jsonParent, k, v);
    const mapping = { json: jsonpath, value: v };
    const vType = typeof v;
    if (vType === 'string' || vType === 'number') {
      const path = `${jsonpath}=${v}`;
      mappings.push(path);
    }
    return mapping;
  };

  const formatJsonPath = function (parent: string, k: string, v: any) {
    let path = '';
    const separator = '.';
    if (parent) {
      if (isNumeric(k)) {
        path = `${parent}[${k}]`;
      } else {
        path = parent + separator + k;
      }
    } else {
      path = k;
    }

    return path;
  };

  const traverseBoth = function (
    jsonObj: { [x: string]: any },
    parentJson: any,
    callback: (arg0: any, arg1: string, arg2: any) => any
  ) {
    if (typeof jsonObj == 'object') {
      for (const key in jsonObj) {
        const mapping = callback(parentJson, key, jsonObj[key]);
        traverseBoth(jsonObj[key], mapping.json, callback);
      }
    } else {
      // jsonOb is a number or string
    }
  };

  traverseBoth(jsonObj, '', formatJsonPropMappings);
  return mappings;
};

export const propertyToJSON = (input: string) => {
  /** keyValue 转 json */
  const property2json = function (propKeyArr: string | any[], value: any, json: any) {
    if (!json) json = {};
    if (!propKeyArr) return json;
    if (!value) return json;
    const parent = json;
    for (let i = 0; i < propKeyArr.length; i++) {
      const arrToJSON = (index: number, parentAny: any) => {
        /** parentAny 浅拷贝 */
        let parentObj = parentAny;
        /** 子数组索引 [number] */
        let arrIndex = propKeyArr[index].match(/(?<=.*)(\[\d+\])$/);
        /** 子变量名 abc[number] */
        let name = cleanse(propKeyArr[index]);

        if (arrIndex) {
          // 存在索引值 [number]
          // 将变量名过滤索引 abc[number] => abc
          name = name.slice(0, Math.max(0, name.length - arrIndex[0].length));
          // 索引取值 [number] => number
          arrIndex = Number.parseInt(arrIndex[0].substring(1, arrIndex[0].length - 1));
          if (index === propKeyArr.length - 1) {
            // 是propKeyArr中最后一位
            if (arrIndex === 0) {
              // 第一位则新建数组
              parentObj[name] = [value];
            } else {
              // 不是第一位便赋值
              parentObj[name][arrIndex] = value;
            }
          } else {
            // 不是propKeyArr中最后一位，即后续还有对象
            if (arrIndex === 0 && !parentObj[name]) {
              // 第一位则新建数组对象，传至下一个递归
              parentObj[name] = [{}];
              arrToJSON(index + 1, parentObj[name][0]);
              parentObj = parentObj[name];
            } else {
              // 不是第一位name
              if (arrIndex < parentObj[name].length) {
                // 不是新的索引值，按照索引，传至下一个递归
                arrToJSON(index + 1, parentObj[name][arrIndex]);
              } else {
                // 新的索引值，新建后对象后，传至下一个递归
                parentObj[name].push({});
                arrToJSON(index + 1, parentObj[name][arrIndex]);
              }
            }
            // 均发生了递归，即i需要自增
            i++;
          }
        } else {
          // 没有索引值
          if (index >= propKeyArr.length - 1) {
            // 最后一位正常赋值
            parentObj[name] = value;
          } else {
            // 第一位新建对象
            parentObj[name] = parentObj[name] || {};
            parentObj = parentObj[name];
            arrToJSON(++i, parentObj);
          }
        }
      };
      arrToJSON(i, parent);
    }
    return json;
  };

  /** 用于name除去空格 */
  const cleanse = function (name: string) {
    try {
      return name.split(' ').join('');
    } catch {
      return name;
    }
  };

  // 根据换行符分组
  const arr = input.split('\n') || [];
  let json = {};
  // 遍历添加json
  arr.forEach((item) => {
    const itemValue = item.split('='),
      value = itemValue[1];
    const propKeyArr = itemValue[0].split('.');
    json = property2json(propKeyArr, value, json);
  });
  return json;
};

export const propertiesExample = `id=1
uuid=3d877494-e7d4-48e3-aa7a-164373a7920d
name=He3
age=26
registered=2020-02-03T06:00:03 -08:00
tags[0]=tools
tags[1]=development
language[0].id=0
language[0].name=English
language[1].id=1
language[1].name=Español
language[2].id=2
language[2].name=Chinese`;

export const yamlExample = `id: 1
uuid: 3d877494-e7d4-48e3-aa7a-164373a7920d
name: He3
age: 26
isActive: true
registered: 2020-02-03T06:00:03 -08:00
tags:
  - tools
  - development
language:
  - id: 0
    name: English
  - id: 1
    name: Español
  - id: 2
    name: Chinese
`;

export const uglyYamlExample = `iid: 1
uuid: 3d877494-e7d4-48e3-aa7a-164373a7920d
name: He3
age: 26
isActive: true
registered: '2020-02-03T06:00:03 -08:00'
tags:
    - tools
    - development
language:
    - {id: 0, name: English}
    - {id: 1, name: Español}
    - {id: 2, name: Chinese}`;

export const yamlToSQLExample = `id: 1
uuid: 3d877494-e7d4-48e3-aa7a-164373a7920d
name: He3
age: 26
isActive: true
registered: 2020-02-03T06:00:03 -08:00
tags:
  - tools
  - development
language:
  - id: 0
    name: English
  - id: 1
    name: Español
  - id: 2
    name: Chinese
`;

export const yamlGeneratorExample = {
  min_position: 'int(3,4,5-9)',
  has_more_items: 'bool',
  items_html: "string('Bus','Car','Bike')",
  new_latent_count: 'int',
  data: {
    length: 'int(20-30)',
    text: 'string',
  },
  numericalArray: ['repeat[5]', 'int(20,23-33)'],
  StringArray: ['repeat[4]', "string('Carbon','Nitrogen','Oxygen')"],
  multipleTypesArray: [3, 'Hello', 5, true],
  objArray: [
    'repeat[5]',
    {
      class: "string('middle','upper','lower')",
      age: 'int',
    },
  ],
};

export async function ObjectiveCInterface(str: string) {
  const obj = yaml.load(str);
  const jsonStr = JSON.stringify(obj, null, 2);
  return await window.$he3.jsonToOther('objective-c', jsonStr);
}
