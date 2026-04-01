import { RequestFull } from "./RequestFull.js";

export type Corsify = (response: Response, request?: RequestFull) => Response;
