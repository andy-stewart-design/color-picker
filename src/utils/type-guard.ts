type NativeType =
  | "string"
  | "number"
  | "boolean"
  | "undefined"
  | "object"
  | "function"
  | "symbol"
  | "bigint";

function isOfType<T extends NativeType>(
  type: T,
  value: unknown
): value is T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "undefined"
  ? undefined
  : T extends "object"
  ? object
  : T extends "function"
  ? Function
  : T extends "symbol"
  ? symbol
  : T extends "bigint"
  ? bigint
  : never {
  return typeof value === type;
}

export { isOfType };
