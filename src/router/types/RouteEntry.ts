import { RequestHandler } from "./RequestHandler.js";

export type RouteEntry = [
  httpMethod: string,
  routeMatch: RegExp,
  handlers: RequestHandler[],
  path?: string,
];
