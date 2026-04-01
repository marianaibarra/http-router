import { RequestFull } from "./RequestFull.js";

export type Preflight = (request: RequestFull) => Response | void;
