interface ErrorFull extends Error {
  status?: number;
  [any: string]: any;
}

type ErrorBody = string | object;

export interface ErrorFormatter {
  (statusCode?: number, body?: ErrorBody): Response;
  (error: ErrorFull): Response;
}
