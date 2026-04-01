import { RequestFull } from "./RequestFull.js";

export type ResponseHandler<ResponseType = any> = (
  response: ResponseType,
  request: RequestFull,
) => any;
