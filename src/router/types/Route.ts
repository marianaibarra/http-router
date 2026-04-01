import { RouterType } from "./RouterType.js";
import { RequestHandler } from "./RequestHandler.js";

export type Route = (path: string, ...handlers: RequestHandler[]) => RouterType;