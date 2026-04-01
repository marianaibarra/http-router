import { DecodeFunction } from "./DecodeFunction.js";

export type ParseOptions = {
  decode?: DecodeFunction;
  secrets?: string | string[];
};
