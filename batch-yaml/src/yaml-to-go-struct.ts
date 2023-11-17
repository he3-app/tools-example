import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'GO',
  inputHandler: function yamlToGoStruct(str: string, flatten?: true) {
    let data;
    let scope;
    let go = '';
    const stack: string[] = [];
    let tabs = 0;

    const seen: Map<string, string[]> = new Map();

    let accumulator = '';
    const innerTabs = 0;
    let parent = '';

    try {
      data = yaml.load(str.replace(/:(\s*\d*)\.0/g, ':$1.1')); // hack that forces floats to stay as floats
      scope = data;
    } catch {
      window.$he3.message.warn('请输入yaml格式字符');
      return '';
      //  error: e, // return error message
    }

    const typename = 'AutoGenerated';
    append(`type ${typename} `);

    parseScope(scope);

    return go;

    function indent(tabs: number) {
      for (let i = 0; i < tabs; i++) go += '\t';
    }

    function indenter(tabs: number) {
      for (let i = 0; i < tabs; i++) stack[stack.length - 1] += '\t';
    }

    function append(str: string) {
      go += str;
    }

    function appender(str: string) {
      stack[stack.length - 1] += str;
    }

    // Sanitizes and formats a string to make an appropriate identifier in Go
    function format(str: string) {
      if (!str) return '';
      else if (str.match(/^\d+$/)) str = `Num${str}`;
      else if (str.charAt(0).match(/\d/)) {
        const numbers = {
          '0': 'Zero_',
          '1': 'One_',
          '2': 'Two_',
          '3': 'Three_',
          '4': 'Four_',
          '5': 'Five_',
          '6': 'Six_',
          '7': 'Seven_',
          '8': 'Eight_',
          '9': 'Nine_',
        };
        str = numbers[str.charAt(0) as keyof typeof numbers] + str.slice(1);
      }
      return toProperCase(str).replace(/[^a-z0-9]/gi, '') || 'NAMING_FAILED';
    }

    // Determines the most appropriate Go type
    function goType(val: any) {
      if (val === null) return 'interface{}';

      switch (typeof val) {
        case 'string':
          if (/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\+\d\d:\d\d|Z)/.test(val)) return 'time.Time';
          else return 'string';
        case 'number':
          if (val % 1 === 0) {
            if (val > -2147483648 && val < 2147483647) return 'int';
            else return 'int64';
          } else return 'float64';
        case 'boolean':
          return 'bool';
        case 'object':
          if (Array.isArray(val)) return 'slice';
          return 'struct';
        default:
          return 'interface{}';
      }
    }

    // Given two types, returns the more specific of the two
    function mostSpecificPossibleGoType(typ1: string, typ2: string) {
      if (typ1.slice(0, 5) == 'float' && typ2.slice(0, 3) == 'int') return typ1;
      else if (typ1.slice(0, 3) == 'int' && typ2.slice(0, 5) == 'float') return typ2;
      else return 'interface{}';
    }

    // Proper cases a string according to Go conventions
    function toProperCase(str: string) {
      // https://github.com/golang/lint/blob/5614ed5bae6fb75893070bdc0996a68765fdd275/lint.go#L771-L810
      const commonInitialisms = [
        'ACL',
        'API',
        'ASCII',
        'CPU',
        'CSS',
        'DNS',
        'EOF',
        'GUID',
        'HTML',
        'HTTP',
        'HTTPS',
        'ID',
        'IP',
        'JSON',
        'LHS',
        'QPS',
        'RAM',
        'RHS',
        'RPC',
        'SLA',
        'SMTP',
        'SQL',
        'SSH',
        'TCP',
        'TLS',
        'TTL',
        'UDP',
        'UI',
        'UID',
        'UUID',
        'URI',
        'URL',
        'UTF8',
        'VM',
        'XML',
        'XMPP',
        'XSRF',
        'XSS',
      ];

      return str
        .replace(/(^|[^a-zA-Z])([a-z]+)/g, (unused, sep, frag) => {
          if (commonInitialisms.includes(frag.toUpperCase())) return sep + frag.toUpperCase();
          else return sep + frag[0].toUpperCase() + frag.slice(1).toLowerCase();
        })
        .replace(/([A-Z])([a-z]+)/g, (unused, sep, frag) => {
          if (commonInitialisms.includes(sep + frag.toUpperCase()))
            return (sep + frag).toUpperCase();
          else return sep + frag;
        });
    }

    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function getOriginalName(unique: string) {
      const reLiteralUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const uuidLength = 36;

      if (unique.length >= uuidLength) {
        const tail = unique.slice(-uuidLength);
        if (reLiteralUUID.test(tail)) {
          return unique.slice(0, -1 * (uuidLength + 1));
        }
      }
      return unique;
    }

    function compareObjects(objectA: any, objectB: any) {
      const object = '[object Object]';
      return (
        Object.prototype.toString.call(objectA) === object &&
        Object.prototype.toString.call(objectB) === object
      );
    }

    function compareObjectKeys(itemAKeys: string[], itemBKeys: string[]) {
      const lengthA = itemAKeys.length;
      const lengthB = itemBKeys.length;

      // nothing to compare, probably identical
      if (lengthA == 0 && lengthB == 0) return true;

      // duh
      if (lengthA != lengthB) return false;

      for (const item of itemAKeys) {
        if (!itemBKeys.includes(item)) return false;
      }
      return true;
    }

    function formatScopeKeys(keys: string[]) {
      for (const i in keys) {
        keys[i] = format(keys[i]);
      }
      return keys;
    }

    function parseScope(scope: any, depth = 0) {
      if (typeof scope === 'object' && scope !== null) {
        if (Array.isArray(scope)) {
          let sliceType = '';
          const scopeLength = scope.length;

          for (let i = 0; i < scopeLength; i++) {
            const thisType = goType(scope[i]);
            if (sliceType === '') sliceType = thisType;
            else if (sliceType != thisType) {
              sliceType = mostSpecificPossibleGoType(thisType, sliceType);
              if (sliceType == 'interface{}') break;
            }
          }

          const slice = flatten && ['struct', 'slice'].includes(sliceType) ? `[]${parent}` : `[]`;

          if (flatten && depth >= 2) appender(slice);
          else append(slice);
          if (sliceType == 'struct') {
            const allFields: any = {};

            // for each field counts how many times appears
            for (let i = 0; i < scopeLength; i++) {
              const keys: string[] = Object.keys(scope[i]);
              for (const k in keys) {
                let keyname = keys[k];
                if (!(keyname in allFields)) {
                  allFields[keyname as keyof typeof allFields] = {
                    value: scope[i][keyname],
                    count: 0,
                  };
                } else {
                  const existingValue = allFields[keyname as keyof typeof allFields].value;
                  const currentValue = scope[i][keyname];

                  if (compareObjects(existingValue, currentValue)) {
                    const comparisonResult = compareObjectKeys(
                      Object.keys(currentValue),
                      Object.keys(existingValue)
                    );
                    if (!comparisonResult) {
                      keyname = `${keyname}_${uuidv4()}`;
                      allFields[keyname] = {
                        value: currentValue,
                        count: 0,
                      };
                    }
                  }
                }
                allFields[keyname].count++;
              }
            }

            // create a common struct with all fields found in the current array
            // omitempty dict indicates if a field is optional
            const keys = Object.keys(allFields),
              struct: any = {},
              omitempty: any = {};
            for (const k in keys) {
              const keyname = keys[k],
                elem = allFields[keyname];

              struct[keyname] = elem.value;
              omitempty[keyname] = elem.count != scopeLength;
            }
            parseStruct(depth + 1, innerTabs, struct, omitempty); // finally parse the struct !!
          } else if (sliceType == 'slice') {
            parseScope(scope[0], depth);
          } else {
            if (flatten && depth >= 2) {
              appender(sliceType || 'interface{}');
            } else {
              append(sliceType || 'interface{}');
            }
          }
        } else {
          if (flatten) {
            if (depth >= 2) {
              appender(parent);
            } else {
              append(parent);
            }
          }
          // 如果判断为Date对象则直接返回 Time
          if (!isNaN(Date.parse(scope))) {
            if (depth >= 2) {
              appender('time.Time');
            } else {
              append('time.Time');
            }
          } else {
            parseStruct(depth + 1, innerTabs, scope);
          }
        }
      } else {
        if (flatten && depth >= 2) {
          appender(goType(scope));
        } else {
          append(goType(scope));
        }
      }
    }

    function parseStruct(depth: number, innerTabs: number, scope: any, omitempty?: any) {
      if (flatten) {
        stack.push(depth >= 2 ? '\n' : '');
      }

      if (flatten && depth >= 2) {
        const parentType = `type ${parent}`;
        const scopeKeys = formatScopeKeys(Object.keys(scope));

        // this can only handle two duplicate items
        // future improvement will handle the case where there could
        // three or more duplicate keys with different values
        if (
          parent in seen &&
          compareObjectKeys(scopeKeys, seen.get(parent) as unknown as string[])
        ) {
          stack.pop();
          return;
        }
        seen.set(parent, scopeKeys);

        appender(`${parentType} struct {\n`);
        ++innerTabs;
        const keys = Object.keys(scope);
        for (const i in keys) {
          const keyname = getOriginalName(keys[i]);
          indenter(innerTabs);
          const typename = format(keyname);
          appender(`${typename} `);
          parent = typename;
          parseScope(scope[keys[i]], depth);
          appender(` \`yaml:"${keyname}`);
          if (omitempty && omitempty[keys[i]] === true) {
            appender(',omitempty');
          }
          appender('"`\n');
        }
        indenter(--innerTabs);
        appender('}');
      } else {
        append('struct {\n');
        ++tabs;
        const keys = Object.keys(scope);
        for (const i in keys) {
          const keyname = getOriginalName(keys[i]);
          indent(tabs);
          const typename = format(keyname);
          append(`${typename} `);
          parent = typename;
          parseScope(scope[keys[i]], depth);
          append(` \`yaml:"${keyname}`);
          if (omitempty && omitempty[keys[i]] === true) {
            append(',omitempty');
          }
          append('"`\n');
        }
        indent(--tabs);
        append('}');
      }
      if (flatten) accumulator += stack.pop();
    }
  },
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
