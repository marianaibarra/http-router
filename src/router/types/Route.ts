import { RouterType } from "./RouterType";
import { RequestHandler } from "./RequestHandler";

export type Route = (path: string, ...handlers: RequestHandler[]) => RouterType;