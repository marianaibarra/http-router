import { Route } from "./Route.js";
import { RouteEntry } from "./RouteEntry.js";

export type RouterType = {
  __proto__: RouterType;
  routes: RouteEntry[];
  fetch: (request: Request) => Promise<any>;
  delete: Route;
  get: Route;
  head: Route;
  options: Route;
  patch: Route;
  post: Route;
  put: Route;
};
