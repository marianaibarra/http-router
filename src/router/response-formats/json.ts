import { createResponse } from "../createResponse.js";

export const json = createResponse(
  "application/json; charset=utf-8",
  JSON.stringify,
);
