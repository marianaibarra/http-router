import { RequestFull } from "./RequestFull.js";

export type ErrorHandler = (error: any, request: RequestFull) => any;
