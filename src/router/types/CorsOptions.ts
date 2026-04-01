export type CorsOptions = {
  credentials?: true;
  origin?:
    | boolean
    | string
    | string[]
    | RegExp
    | ((origin: string) => string | void);
  maxAge?: number;
  allowMethods?: string | string[];
  allowHeaders?: any;
  exposeHeaders?: string | string[];
};
