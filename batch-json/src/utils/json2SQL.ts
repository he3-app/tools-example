import { Parser } from 'sql-ddl-to-json-schema';
import dayjs from 'dayjs';
import prettyJson from 'json-stringify-pretty-compact';
import { format } from 'sql-formatter';
import { ErrorLine } from './json2Yaml';
/**
 * Merges field arrays to resolve the most generic field type
 */
class FieldsMerger {
  fieldsHash: { [key: string]: any };
  fields: any[];
  /**
   *
   * @param {*} fieldsArray  Array of fields definition
   */
  constructor(fieldsArray: any) {
    this.fieldsHash = {};
    fieldsArray.map((fields: { [x: string]: any }) => {
      Object.keys(fields).map((key) => {
        const field = fields[key];
        const currentField = this.fieldsHash[field.name];
        if (currentField) {
          if (currentField.type == field.type) {
            return;
          } else {
            // Types donot match
            switch (currentField.type) {
              case 'json':
                return; // Its already super generic.
              case 'text':
                if (field.type == 'json') {
                  currentField.type = 'json';
                }
                break;

              case 'string':
                if (field.type == 'json') {
                  currentField.type = 'json';
                }
                if (field.type == 'text') {
                  currentField.type = 'text';
                }
                break;
              case 'integer':
              case 'date':
                currentField.type = 'string'; // If its an int or a date and the next type is not, just put string
                break;
            }
          }
        } else {
          this.fieldsHash[field.name] = field;
        }
      });
    });
    this.fields = Object.values(this.fieldsHash);
  }
}

/**
 * Object Analyzer analyzes an objects and determines the types of fields
 */
class ObjectAnalyzer {
  object: any;
  type: string;
  options: { [key: string]: any };
  fields: any;
  static allFields: any;
  /**
   *
   * @param {*} object The object to be parsed for analysis
   * @param {*} options Options for parsing. See docs.
   */
  constructor(object: any, options: any = {}) {
    this.object = object;
    this.type = typeof object;

    if (this.type !== 'object') {
      throw new Error(`Argument must be an object, received ${this.type}`);
    }
    if (Array.isArray(object)) {
      this.type = 'array';
    }
    this.options = options;

    this.fields = (this.constructor as any).analyzeObject(object, this.options);
  }
  /**
   *
   * @param {*} object The object to be parsed
   * @param {*} options Options
   * @return {Array} List of fields and types detected {type: "object|integer|decimal...", name:"name of field"}
   */
  static analyzeObject(object: any, options: any): Array<any> {
    const {
      detectDateStrings = true,
      detectNumericStrings = true,
      stringCharacterLimit = 255,
    } = options;

    if (Array.isArray(object)) {
      const allFields = object.map((row) => {
        return this.analyzeObject(row, options);
      });
      this.allFields = allFields;
      const merger = new FieldsMerger(allFields);
      return merger.fields;
    }
    // 非对象数组遍历时存在object为number或string的情况，此时设置默认key为value
    if (typeof object !== 'object') {
      object = { value: object };
    }
    const keys = Object.keys(object);
    return keys.map((key) => {
      /* Goes over each key in the object and tries to determine its type */
      const value = object[key];
      let type: string = typeof value;
      if (value === null) {
        type = 'json';
      } else {
        switch (type) {
          case 'number':
            if (value % 1 === 0) {
              type = 'integer';
            } else {
              type = 'decimal';
            }
            break;
          case 'string':
            const numeric = Number(value);
            if (!isNaN(numeric)) {
              if (detectNumericStrings) {
                if (value % 1 === 0) {
                  type = 'integer';
                } else {
                  type = 'decimal';
                }
              }
            } else if (detectDateStrings) {
              if (dayjs(value).format() !== 'Invalid Date') {
                type = 'date';
              }
            }

            if (value.length > stringCharacterLimit) {
              type = 'text';
            }
            break;
          case 'object':
            try {
              type = value.constructor.name.toLowerCase();
            } catch {
              type = 'json';
            }
            break;
        }
      }
      return { name: key, type };
    });
  }
}

/**
 * Creates an sql schema as Create, Update or Sequelize models
 */
class SQLSchemaGenerator {
  rootTableName: string;
  fields: any;
  object: any;
  parentTable: {
    keyName?: string;
    keyType?: any;
    tableName: any;
  } | null;
  /**
   * @param {string} rootTableName 表名
   * @param {Array<Object>} data  需要转换的json对象
   * @param {{
   *  keyName:string,
   *  keyType:string,
   *  tableName:string
   * }} parentTable 父表信息
   */
  constructor(
    rootTableName: string,
    data: { [key: string]: any },
    parentTable: {
      keyName?: string;
      keyType?: any;
      tableName: any;
    } | null = null
  ) {
    // 解析json对象
    const { fields, type, object } = new ObjectAnalyzer(data);
    /** 表名 */
    this.rootTableName = rootTableName;
    /** 对象中key对应的类型 */
    this.fields = fields;
    /** 源数据 */
    this.object = object;
    /** 父表信息 */
    this.parentTable = parentTable;
  }
  /**
   * Genereates Create statements for sql
   * @return {string} The create statement for this table
   */
  generateCreateStatements(): string {
    /** 子表信息 */
    const subTable = [];
    /** 主表信息 */
    const fieldStatements = [];
    /** 主键信息 */
    let primaryKey: { keyName: any; keyType: any } | null | undefined = null;

    // 遍历主表，转换对应信息
    for (const field of this.fields) {
      // 数组类型转换为子表
      if (field.type === 'array') {
        subTable.push({
          name: `${this.rootTableName}_${field.name}`,
          data: this.object[field.name],
        });
      } else {
        const Descriptor = (this.constructor as any).getFieldDescriptor(field.type);
        fieldStatements.push(`${field.name} ${Descriptor}`);
        // 保存主键信息
        if (field.name.toLowerCase() === 'id') {
          primaryKey = { keyName: field.name, keyType: Descriptor };
        }
      }
    }

    // 添加主键，没有主键则新建默认id
    if (primaryKey) {
      fieldStatements.push(`PRIMARY KEY (${primaryKey.keyName})`);
    } else {
      fieldStatements.unshift(`id int`);
      fieldStatements.push(`PRIMARY KEY (id)`);
      primaryKey = { keyName: 'id', keyType: 'int' };
    }

    // 子表信息
    const subTableList = subTable
      .map((obj) => {
        const { name, data } = obj;
        return new SQLSchemaGenerator(name, data, {
          ...primaryKey,
          tableName: this.rootTableName,
        }).generateCreateStatements();
      })
      .join('\n');

    // 添加外键
    if (this.parentTable) {
      const id = `${this.parentTable.tableName}_${this.parentTable.keyName}`;
      fieldStatements.unshift(`${id} ${this.parentTable.keyType}`);
      fieldStatements.push(
        `FOREIGN KEY (${id}) REFERENCES ${this.parentTable.tableName}(${this.parentTable.keyName})`
      );
    }

    // 主表信息
    const mainTable = `CREATE TABLE ${this.rootTableName} (${fieldStatements.join(',')});\n`;
    return mainTable + subTableList;
  }
  /**
   *
   * @param {string} type  Type of Field : OneOf(string, integer, decimal, date)
   * @return {string} The SQL descriptior for field type
   */
  static getFieldDescriptor(type: any): string {
    switch (type) {
      case 'string':
        return 'varchar(255)';
      case 'integer':
        return 'int';
      case 'decimal':
        return 'decimal(10,3)';
      case 'date':
        return 'datetime';
      case 'text':
        return 'text';
      case 'object':
        return 'json';
      case 'boolean':
        return 'boolean';
      default:
        return '';
    }
  }
}

const parser = new Parser('mysql');

const getDefault = (type: string) => {
  switch (type) {
    /** 数字处理 */
    case 'int':
    case 'decimal':
    case 'float':
    case 'double':
    case 'bit':
      return 0;
    /** 布尔值处理 */
    case 'boolean':
      return false;
    /** 时间处理 */
    case 'date':
      return dayjs().format('YYYY-MM-DD');
    case 'time':
      return dayjs().format('HH:MM:ss');
    case 'datetime':
      return dayjs().format('YYYY-MM-DDTHH:MM:ss');
    case 'timestamp':
      return dayjs().format('YYYYMMDD HHMMss');
    case 'year':
      return dayjs().format('YYYY');
    /** 对象处理 */
    case 'json':
      return {};
    /** 字符串处理 */
    case 'blob':
    case 'varbinary':
    case 'binary':
      return '0';
    // case 'varchar':
    // case 'text':
    // case 'char':
    // case 'enum':
    // case 'set':
    default:
      return '';
  }
};

function sqlErrorLine(message: string) {
  const num = (message as string).match(/(?<=Syntax error at line )(\d+(?= col ))/);

  if (num) {
    const mes = message.split('Instead')[0];
    throw new (ErrorLine as any)(mes || message, Number.parseInt(num[0]));
  } else {
    throw new Error(message);
  }
}

export const schemaToJson = (sql: string) => {
  try {
    const obj = parser.feed(sql).toCompactJson(parser.results);
    const json: { [key: string]: object } = {};
    for (const item of obj) {
      const keyValue: { [key: string]: any } = {};
      // 该表存在columns
      if (item.columns) {
        for (const column of item.columns) {
          keyValue[column.name] = column.options?.default || getDefault(column.type.datatype);
        }

        // 存在外键，查看是否符合数组｜对象数组形式
        if (item.foreignKeys && item.foreignKeys.length === 1) {
          // 外键
          const foreignKeys = item.foreignKeys[0].columns[0].column;
          // 相关表
          const reference = item.foreignKeys[0].reference.table.split('_');
          let deepKey: any = json;
          for (const tableItem of reference) {
            deepKey = deepKey[tableItem];
          }

          // 若存在相关对象或表，则通过表名添加
          if (deepKey && foreignKeys) {
            const itemName = item.name.split('_').at(-1);
            if (itemName) {
              // 移除外键
              delete keyValue[foreignKeys];
              const keyArr = Object.keys(keyValue);
              // 判断是否为数组
              if (keyArr.length === 2 && keyArr[0] === 'id' && keyArr[1] === 'value') {
                deepKey[itemName] = [keyValue.value];
              } else {
                deepKey[itemName] = [keyValue];
              }
            }
          } else {
            json[item.name] = keyValue;
          }
        } else {
          json[item.name] = keyValue;
        }
      } else {
        json[item.name] = keyValue;
      }
    }
    // 如果只有一个key，则拍平
    const jsonKeys = Object.keys(json);
    if (jsonKeys.length === 1) {
      return {
        json: prettyJson(json[jsonKeys[0]], { maxLength: 20 }),
        name: jsonKeys[0],
      };
    } else {
      return { json: prettyJson(json, { maxLength: 20 }), name: undefined };
    }
  } catch (error: any) {
    sqlErrorLine(error.message);
  }
};

export const jsonToSchema = (json: { [key: string]: any }) => {
  // 判断是否为多个table
  let isObject = true;
  for (const item in json) {
    if (json[item]?.constructor !== Object) {
      isObject = false;
      break;
    }
  }

  if (isObject) {
    let sql = '';
    for (const item in json) {
      const schGen = new SQLSchemaGenerator(item, json[item]);
      const sqlItem = schGen.generateCreateStatements();
      sql += `${sqlItem}\n`;
    }
    return format(sql, {
      language: 'sql',
    });
  } else {
    const schGen = new SQLSchemaGenerator('EXAMPLE', json);
    const sql = schGen.generateCreateStatements();
    return format(sql, {
      language: 'sql',
    });
  }
};
