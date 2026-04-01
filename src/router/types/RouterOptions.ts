import { ErrorHandler } from "./ErrorHandler.js";
import { RequestHandler } from "./RequestHandler.js";
import { ResponseHandler } from "./ResponseHandler.js";
import { RouteEntry } from "./RouteEntry.js";

export type RouterOptions = {
  base?: string;
  routes?: RouteEntry[];

  // middlewares, etc...
  middlewares?: RequestHandler[];
  catch?: ErrorHandler;
  finally?: ResponseHandler[];
};
