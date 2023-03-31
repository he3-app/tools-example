import TOML from '@ltd/j-toml';
// import YAML from 'yaml'

/** 序列化对象，用于json转toml时，字符串转对象序列化 */
function serializedObject(key: number | string, value: any): any {
  if (typeof value === 'object' && !Array.isArray(value)) {
    return TOML.Section({ ...(value as object) });
  } else {
    return value;
  }
}

export function tomlToJson(str: string) {
  try {
    return JSON.stringify(TOML.parse(str, { bigint: false, joiner: '\r\n' }), null, ' ');
  } catch {
    return str;
  }
}

// export function tomlToYaml(str: string) {
//   try {
//     return YAML.stringify(
//       TOML.parse(str, { bigint: false, joiner: '\r\n' }),
//       null,
//       ' ',
//     )
//   } catch (e: any) {
//     return str
//   }
// }

export function jsonToToml(str: string) {
  try {
    const json = JSON.parse(str, serializedObject);
    return TOML.stringify(json, {
      newline: '\r\n',
      integer: Number.MAX_SAFE_INTEGER,
      newlineAround: 'document',
    }).replace(/\r\n/, '');
  } catch {
    return str;
  }
}
