function trimStr(str: string) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

function isArray(o: any) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function firstToUpperCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function camelCase(input: string) {
  return input.replace(/_(.)/g, (match: any, group1: string) => {
    return group1.toUpperCase();
  });
}

function camelCaseWithFirstCharUpper(input: string) {
  if (!input) {
    return '';
  }

  input = camelCase(input);
  return input[0].toUpperCase() + input.slice(1);
}

function trimSpecial(input: string) {
  if (!input) {
    return input;
  }

  return trimStr(input.replace(/\|\s*[0-9]*/g, ''));
}

function isDate(date: any) {
  return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)) && isNaN(+date);
}

function isInt(n: number) {
  return n % 1 === 0;
}

const IMPORT_MAP: {
  [key: string]: any;
} = {
  Date: 'java.util.Date',
  List: 'java.util.List',
}; // 支持set和get这种老式的模板

const SET_GET_TPL =
  '\n    public void setA(T a) {\n        this.a = a;\n    }\n    public T getA() {\n        return a;\n    }\n    ';
const DEFAULT_CLASS_NAME = 'Example';
const DEFAULT_PACKAGE_NAME = 'com.example.tool';

function getBeanFieldFromJson(text: string | any[], className: string) {
  if (!text || typeof text === 'object') {
    throw '请输入正确的json格式';
  }

  let jsonObject = null;
  text = trimStr(text);
  text = trimSpecial(text); // 1.先将文本转换成json实体, 把首尾空格去掉，那么如果第一和最后一个字符为[]，说明是json数组，而非对象

  if (text[0] === '[' && text[text.length - 1] === ']') {
    text = `{ "list": ${text}}`;

    try {
      jsonObject = JSON.parse(text).list[0];
    } catch (e) {
      console.log('[getBeanFieldFromJson]parse json error:', e);
    }
  } else {
    try {
      jsonObject = JSON.parse(text);
    } catch (e) {
      console.log('[getBeanFieldFromJson]parse json error:', e);
    }
  } // 2.将json对象转换成bean类

  let bean: {
    [key: string]: any;
  } = {};
  const attrClassAry: any = [];

  for (const key in jsonObject) {
    const val = jsonObject[key];
    bean[key] = getTypeFromJsonVal(val, key, attrClassAry);
  }

  if (!className) {
    className = 'A';
  } else {
    className = camelCaseWithFirstCharUpper(className);
    className = trimSpecial(className);
  }

  bean = {
    name: className,
    val: bean,
  };
  return [bean].concat(attrClassAry);
}

function toBeanText(bean: { val?: any; name?: any }, packageName: string, isLomBook: any) {
  if (!bean) {
    return;
  }

  const beanFields = bean.val;
  const className = bean.name;
  let importText = '';
  let fieldText = '';
  let setterText = '';
  const typeSet: {
    [key: string]: any;
  } = {};
  const tpl = SET_GET_TPL; // 依次遍历每个属性

  for (const key in beanFields) {
    // 如果存在下划线小写格式的属性名，要改成驼峰命名
    const camelKey = camelCase(key); // 生成属性定义

    fieldText += '   private '.concat(beanFields[key], ' ').concat(camelKey, ';\n    '); // 记录属性类型,beanFields[key]可能有一些值，是List<Date>之类，要替换成Date

    let type = beanFields[key];

    if (type.includes('List<')) {
      type = beanFields[key].replace('List<', '');
      type = type.replace('>', '');
      typeSet['List'] = 'true';
    }

    typeSet[type] = 'true';

    if (!isLomBook) {
      (function () {
        // 生成setter，getter语句
        const tplMap: {
          [key: string]: any;
        } = {
          a: camelKey,
          A: firstToUpperCase(camelKey),
          T: beanFields[key],
        };
        setterText += tpl.replace(/a|A|T/g, (matched) => {
          return tplMap[matched];
        });
      })();
    }
  } // 生成import语句

  for (const t in typeSet) {
    if (IMPORT_MAP[t]) {
      importText += `import ${IMPORT_MAP[t]};\n`;
    }
  }

  if (packageName) {
    importText = `package ${packageName};\n${importText}`;
  } // 把import, 属性定义，setter，getter拼到一起

  let fileContent = '';

  if (isLomBook) {
    fileContent = ''
      .concat(
        importText,
        '\nimport lombok.AllArgsConstructor;\nimport lombok.Data;\nimport lombok.NoArgsConstructor;\n\n@Data\n@AllArgsConstructor\n@NoArgsConstructor\npublic class '
      )
      .concat(className, ' {\n\n')
      .concat(fieldText, '\n\n}');
  } else {
    fileContent = ''
      .concat(importText, '\n\npublic class ')
      .concat(className, ' {\n\n')
      .concat(fieldText, '\n\n')
      .concat(setterText, '\n\n}');
  }

  return {
    fileContent,
    className,
  };
}

function getTypeFromJsonVal(val: any, key: string, attrClassAry: any[]) {
  if (val && val.replace) {
    val = val.replace(/ /g, '');
  }

  const typeofStr = typeof val;

  if (typeofStr === 'number') {
    if (isInt(val)) {
      return 'int';
    } else {
      return 'double';
    }
  } else if (typeofStr === 'boolean') {
    return typeofStr;
  } else if (isDate(val)) {
    return 'Date';
  } else if (!val) {
    return 'String';
  } else if (typeofStr === 'string') {
    return 'String';
  } else {
    if (isArray(val)) {
      const type: any = getTypeFromJsonVal(val[0], key, attrClassAry);
      return `List<${type}>`;
    } else {
      // 自定义类
      let typeName = camelCaseWithFirstCharUpper(key);
      typeName = trimSpecial(typeName);
      const bean: {
        [key: string]: any;
      } = {};

      for (key in val) {
        const fieldValue = val[key];
        bean[key] = getTypeFromJsonVal(fieldValue, key, attrClassAry);
      }

      attrClassAry.push({
        name: typeName,
        val: bean,
      });
      return typeName;
    }
  }
}
/**
 * 执行函数
 * @param text json格式的文本
 * @param className 类名
 * @param packageName 包名称
 * @param isLomBook 是否使用注解形式生成java bean
 * @return {*}
 */
export function json2java(
  text: string,
  className?: string,
  packageName?: string,
  isLomBook?: boolean
) {
  if (!text) {
    return;
  }

  if (!className) {
    className = DEFAULT_CLASS_NAME;
  }

  if (!packageName) {
    packageName = DEFAULT_PACKAGE_NAME;
  }

  try {
    const beans = getBeanFieldFromJson(text, className);
    return (beans || []).map((bean) => {
      return toBeanText(bean, packageName as string, isLomBook);
    });
  } catch (e) {
    console.log('错误解析：', e);
  }
}
