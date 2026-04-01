import { RequestHandler } from "./RequestHandler.js";
import { ResponseHandler } from "./ResponseHandler.js";
import { RouterOptions } from "./RouterOptions.js";

export type AutoRouterOptions = {
  missing?: RequestHandler;
  format?: ResponseHandler; // handles response automatically
} & RouterOptions;
