import dayjs from 'dayjs';

let outputs: string[] = [];
const GetGoType = (val: any): string => {
  const type = typeof val;
  switch (type) {
    case 'string':
      if (
        /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\s\-\d\d:\d\d|Z)/.test(val) ||
        dayjs(val).format() !== 'Invalid Date'
      )
        return 'time.Time';
      return 'string';
    case 'object':
      return 'object';
    case 'number':
      if (val % 1 === 0) return 'int';
      return 'float64';
    case 'bigint':
      return 'int64';
    case 'boolean':
      return 'bool';
  }
  return 'interface{}';
};

const EvaluateArray = (objName: string, array: any[]): string => {
  const type = typeof array[0];
  if (type == 'object') {
    Evaluate(objName, array[0]);
  }
  return `[]${GetGoType(array[0])}`;
};

const Evaluate = (objName: string, obj: { [index: string]: any }) => {
  const keys: string[] = Object.keys(obj);
  let output = `type ${objName} struct {\n`;
  keys.forEach((key) => {
    let type = GetGoType(obj[key]);
    const varName = `${key[0].toUpperCase()}${key.slice(1)}`;
    if (type == 'object') {
      if (Array.isArray(obj[key])) {
        let typeName = varName;
        if (varName.slice(-1) == 's') {
          typeName = varName.slice(0, -1);
        }
        type = EvaluateArray(typeName, obj[key]);
        if (type == '[]object') {
          type = `[]${typeName}`;
        }
      } else {
        type = varName;
        Evaluate(varName, obj[key]);
      }
    }
    output += `\t${varName} ${type} \`json:"${key}"\`\n`;
  });
  output += '}';
  outputs.push(output);
};

export const Go = (json: string): string[] => {
  outputs = [];

  const obj = JSON.parse(json);
  Evaluate('Data', obj);

  return outputs;
};
