import type { RxJsonSchema } from 'rxdb';

export const forWhoArray = ['BOTH', 'JIM', 'EVE', 'OTHER'];
export const fromWhoArray = ['JIM', 'EVE', 'OTHER'];

//changed camelCase to snake_case for db storage sync to sqlite?
export type ExpenseDocType = {
  id: string;
  amount: number;
  date: string;
  category_id: string;
  comment: string;
  for_who: string;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const expenseSchema: RxJsonSchema<ExpenseDocType> = {
  title: 'expense schema',
  description: 'describes a single expense item',
  version: 1,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    amount: {
      type: 'integer',
    },
    date: {
      type: 'string',
      format: 'date',
      maxLength: 10, // 2026-01-31 is 10 characters
    },
    category_id: {
      type: 'string',
      maxLength: 100, // <- category id name max length
    },
    for_who: {
      type: 'string',
    },
    comment: {
      type: 'string',
    },
    created_at: {
      type: 'number',
    },
    updated_at: {
      type: 'number',
      minimum: 0,
      maximum: 9999999999999, //Saturday, November 20, 2286 5:46:39.999 PM GMT+00:00
      multipleOf: 1,
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['id', 'amount', 'date', 'for_who', 'category_id', 'created_at', 'updated_at'],
  indexes: ['date', 'category_id', 'updated_at'],
};

export type CategoryDocType = {
  //id: string;
  name: string;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const categorySchema: RxJsonSchema<CategoryDocType> = {
  title: 'category schema',
  description: 'describes a single category item',
  version: 0,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    created_at: {
      type: 'number',
    },
    updated_at: {
      type: 'number',
      minimum: 0,
      maximum: 9999999999999, //Saturday, November 20, 2286 5:46:39.999 PM GMT+00:00
      multipleOf: 1,
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['name', 'created_at', 'updated_at'],
  indexes: ['updated_at'],
};

export type IncomeSourceDocType = {
  name: string;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const incomeSourceSchema: RxJsonSchema<IncomeSourceDocType> = {
  title: 'income source schema',
  description: 'describes a single income source item',
  version: 0,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    created_at: {
      type: 'number',
    },
    updated_at: {
      type: 'number',
      minimum: 0,
      maximum: 9999999999999, //Saturday, November 20, 2286 5:46:39.999 PM GMT+00:00
      multipleOf: 1,
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['name', 'created_at', 'updated_at'],
  indexes: ['updated_at'],
};

export type IncomeDocType = {
  id: string;
  amount: number;
  date: string;
  source_id: string;
  comment: string;
  from_who: string;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const incomeSchema: RxJsonSchema<IncomeDocType> = {
  title: 'income schema',
  description: 'describes a single income item',
  version: 1,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    amount: {
      type: 'integer',
    },
    date: {
      type: 'string',
      format: 'date',
      maxLength: 10, // 2026-01-31 is 10 characters
    },
    source_id: {
      type: 'string',
      maxLength: 100, // <- income source id name max length
    },
    comment: {
      type: 'string',
    },
    from_who: {
      type: 'string',
    },
    created_at: {
      type: 'number',
    },
    updated_at: {
      type: 'number',
      minimum: 0,
      maximum: 9999999999999, //Saturday, November 20, 2286 5:46:39.999 PM GMT+00:00
      multipleOf: 1,
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['id', 'amount', 'date', 'from_who', 'source_id', 'created_at', 'updated_at'],
  indexes: ['date', 'source_id', 'updated_at'],
};

export type familyMemberSchemaType = {
  name: string;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const familyMemberSchema: RxJsonSchema<familyMemberSchemaType> = {
  title: 'family member schema',
  description: 'describes a single family member',
  version: 0,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    created_at: {
      type: 'number',
    },
    updated_at: {
      type: 'number',
      minimum: 0,
      maximum: 9999999999999, //Saturday, November 20, 2286 5:46:39.999 PM GMT+00:00
      multipleOf: 1,
    },
    _deleted: {
      type: 'boolean',
    },
  },
  required: ['name', 'created_at', 'updated_at'],
  indexes: ['updated_at'],
};
