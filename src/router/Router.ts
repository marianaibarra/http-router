import { RequestHandler } from "./types/RequestHandler.js";
import { RouterType } from "./types/RouterType.js";
import { RouterOptions } from "./types/RouterOptions.js";
import { RequestFull } from "./types/RequestFull.js";

export const Router = ({
  base = "",
  routes = [],
  ...other
}: RouterOptions = {}): RouterType =>
  // @ts-ignore
  ({
    // @ts-ignore
    __proto__: new Proxy(
      {},
      {
        // @ts-expect-error
        get:
          (target: any, prop: string, receiver: object, path: string) =>
          (route: string, ...handlers: RequestHandler[]) => {
            routes.push([
              prop.toUpperCase(),
              RegExp(
                `^${
                  (path = (base + route).replace(/\/+(\/|$)/g, "$1")) // strip double & trailing splash
                    .replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))") // greedy params
                    .replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))") // named params and image format
                    .replace(/\./g, "\\.") // dot in path
                    .replace(/(\/?)\*/g, "($1.*)?") // wildcard
                }/*$`,
              ),
              handlers,
              path,
            ]);
            return receiver;
          },
      },
    ),

    routes,

    async fetch(request: RequestFull) {
      let response,
        match,
        url = new URL(request.url),
        //   Avoid prototype pollution. TODO: Quitarlo para ver que pasa.
        query: Record<string, any> = (request.query = { __proto__: null });

      //   parse query params
      for (let [key, value] of url.searchParams) {
        query[key] = query[key] ? [].concat(query[key], value as any) : value;
      }

      t: try {
        for (let middleware of other.middlewares || [])
          if ((response = await middleware(request)) != null) break t;

        // find matching route
        matchingRoute: for (let [
          httpMethod,
          routeMatch,
          handlers,
          path,
        ] of routes) {
          if (
            httpMethod == request.method &&
            (match = url.pathname.match(routeMatch))
          ) {
            request.params = match.groups || {};
            request.route = path;

            for (let handler of handlers)
              if ((response = await handler(request)) != null)
                break matchingRoute;
          }
        }
      } catch (error: any) {
        if (!other.catch) throw error;
        response = await other.catch(error, request);
      }

      try {
        for (let handler of other.finally || [])
          response = (await handler(response, request)) ?? response;
      } catch (error: any) {
        if (!other.catch) throw error;
        response = await other.catch(error, request);
      }

      return response;
    },
  });
