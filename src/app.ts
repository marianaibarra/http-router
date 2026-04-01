import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { AutoRouter } from "./router/AutoRouter.js";
import { autoCookieParser } from "./router/cookies-parser.js";
import { cors } from "./router/cors.js";

const { preflight, corsify } = cors({});

/**
 * TODO:
 * - Organizar extensión archivos
 */

const autoRouter = AutoRouter({
  middlewares: [preflight, autoCookieParser],
  finally: [corsify],
});

autoRouter.get("/", (req) => {
  console.log("cookies", req.cookies);
  return { hola: "mundo" };
});

export default autoRouter;

function requestListener(
  handler: (req: Request) => Response | Promise<Response>,
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = `http://${req.headers.host || "localhost"}${req.url}`;
      const request = new Request(url, {
        method: req.method as string,
        headers: req.headers as any,
        // body: stream ?? undefined as any,
        body:
          req.method !== "GET" && req.method !== "HEAD"
            ? (req as any)
            : undefined,
        duplex: "half",
      });

      const response = await handler(request);

      res.statusCode = response.status;

      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }

      res.end();
    } catch (error) {
      console.error("error", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  };
}

const httpServer = createServer(requestListener(autoRouter.fetch));
httpServer.listen(3001);
