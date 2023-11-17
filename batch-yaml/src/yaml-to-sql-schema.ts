import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { format } from 'sql-formatter';
import dayjs from 'dayjs';

const sampleData = `id: 1
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

const jsonToSchema = (json: { [key: string]: any }) => {
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

export default transformTool({
  inputLang: 'SQL',
  outputLang: 'SQL',
  sampleData,
  inputHandler: (str: string) => {
    const obj = yaml.load(str);
    return jsonToSchema(obj as { [key: string]: any });
  },
});
