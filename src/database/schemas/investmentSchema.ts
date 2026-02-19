import type { RxJsonSchema } from "rxdb";

//Not sure if I will use this
//changed camelCase to snake_case for db storage sync to sqlite?
export type InvestmentDocType = {
  id: string;
  initial_amount: number; // amount invested
  final_amount: number; // amount at maturity or now
  rate: number; // rate in percent
  date: string; // date invested
  term: string; // term invested
  type: "GIC" | "MUTUAL" | "OTHER";
  where: "RBC" | "ACU" | "OTHER";
  registered: "RRSP" | "TFSA" | "RIF" | "OTHER" | "NOT_REGISTERED";
  for_who: "BOTH" | "JIM" | "EVE" | "OTHER";
  comment: string;
  done: boolean;
  created_at: number;
  updated_at: number;
  _deleted: boolean;
};

export const investmentSchema: RxJsonSchema<InvestmentDocType> = {
  title: "investment schema",
  description: "describes a single investment item",
  version: 1,
  //keyCompression: true, //<- must wrap storage with wrappedKeyCompressionStorage
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // <- the primary key must have set maxLength
    },
    initial_amount: {
      type: "integer",
    },
    final_amount: {
      type: "integer",
    },
    rate: {
      type: "integer",
    },
    date: {
      type: "string",
      format: "date",
      maxLength: 10, // 2026-01-31 is 10 characters
    },
    term: {
      type: "string",
    },
    type: {
      type: "string",
      enum: ["GIC", "MUTUAL", "OTHER"],
    },
    where: {
      type: "string",
      enum: ["RBC", "ACU", "OTHER"],
    },
    registered: {
      type: "string",
      enum: ["RRSP", "TFSA", "RIF", "OTHER", "NOT_REGISTERED"],
    },
    for_who: {
      type: "string",
      enum: ["BOTH", "JIM", "EVE", "OTHER"],
    },
    comment: {
      // TODO: this should be a text field
      type: "string",
    },
    done: {
      type: "boolean",
    },
    created_at: {
      type: "number",
    },
    updated_at: {
      type: "number",
    },
    _deleted: {
      type: "boolean",
    },
  },
  required: [
    "id",
    "initial_amount",
    "final_amount",
    "rate",
    "date",
    "term",
    "type",
    "where",
    "registered",
    "for_who",
    "comment",
    "created_at",
    "updated_at",
    "_deleted",
  ],
  indexes: ["updated_at"],
};
