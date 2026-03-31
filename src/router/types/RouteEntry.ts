import { RequestHandler } from "./RequestHandler";

export type RouteEntry = [
  httpMethod: string,
  routeMatch: RegExp,
  handlers: RequestHandler[],
  path?: string,
];
