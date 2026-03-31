import { Router } from "./router/Router.js";
import { createServer, IncomingMessage, ServerResponse } from "node:http";

const router = Router({
  routes: [],
});

router.get("/", (req) => {
  // console.log("req", req);
  return new Response("OK");
});

router.get("/groups", (req) => {
  return Response.json([
    {
      id: 5,
      name: "NewJeans",
      members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"],
      debutYear: 2022,
    },
  ]);
});

router.get("/groups/:id", (req: any) => {
  // console.log(req.params.id);

  return Response.json([
    {
      id: 5,
      name: "NewJeans",
      members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"],
      debutYear: 2022,
    },
  ]);
});

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

      // Logger

      console.log(`Incoming request ${request.method}, ${request.url}`);

      const response = await handler(request);

      //   TODO: El router no coloca estado, ni headers por defecto, debe responder con new Response(...)
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

const httpServer = createServer(requestListener(router.fetch));
httpServer.listen(3001);
