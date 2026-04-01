// Defaults to json

import { error } from "./response-formats/error.js";
import { json } from "./response-formats/json.js";
import { Router } from "./Router.js";
import { AutoRouterOptions } from "./types/AutoRouterOptions.js";

export const AutoRouter = ({
  format = json,
  missing = () => error(404),
  finally: f = [],
  middlewares = [],
}: AutoRouterOptions) =>
  Router({
    middlewares: [...middlewares],

    catch: error,

    finally: [
      // @ts-ignore
      (response: any, ...args) => response ?? missing(...args),
      format,
      ...f,
    ],
  });
