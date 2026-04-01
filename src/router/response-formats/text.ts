import { createResponse } from "../createResponse.js";

export const text = createResponse("text/plain; charset=utf-8", String);
